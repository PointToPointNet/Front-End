import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/total-packet.module.scss";
import { IoMdHelpCircleOutline } from "react-icons/io";

interface PacketData {
  date: string;
  rxData: number;
  txData: number;
}

interface TotalPacketProps {
  packetData: PacketData[] | null;
}

const TotalPacket: React.FC<TotalPacketProps> = ({ packetData }) => {
  const packetRef = useRef<SVGSVGElement | null>(null);
  const colorValues = ["#FFD7A3", "#FF6060"];

  const [helperVisible, setHelperVisible] = useState(false);

  const drawGraph = (
    svgRef: React.RefObject<SVGSVGElement>,
    data: PacketData[]
  ) => {
    if (!svgRef.current || data.length === 0) return;

    // 그래프의 크기 세팅
    const width = parseInt(d3.select("#packetbox").style("width"), 10) - 20;
    const height = 220;
    const margin = { top: 20, right: 40, bottom: 20, left: 30 };
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
    .scaleBand()
    .domain(data.map((_, i) => i.toString())) 
    .range([0, innerWidth])
    .padding(0)

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          d3.max(data, (d) => d.rxData) || 0,
          d3.max(data, (d) => d.txData) || 0
        )
      ])
      .nice()
      .range([innerHeight, 0]);

    let graphGroup = svg.select(".graph-group");
    if (graphGroup.empty()) {
      graphGroup = svg
        .append("g")
        .attr("class", "graph-group")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .style("stroke", "#aaa");
    }

    //x축입니다
    graphGroup.select(".x-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(data.length)
          .tickFormat((d, i) => data[i]?.date)
      )
      .style("stroke", "#aaa");

    //y축입니다
    graphGroup.select(".y-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(10))
      .style("stroke", "#aaa");

    // 가로 보조선 추가
    const gridLines = graphGroup.selectAll(".grid-line").data(yScale.ticks(10)); // y축 눈금 기준으로 보조선 추가
    gridLines
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .merge(gridLines)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#555") // 보조선 색상
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4"); // 점선 스타일 (원하면 제거 가능)

    gridLines.exit().remove();

    //선그래프 생성 - rx
    const rxLineGenerator = d3
      .line<PacketData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.rxData))
      .curve(d3.curveMonotoneX);

    // 선그래프생성 - tx
    const txLineGenerator = d3
      .line<PacketData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.txData))
      .curve(d3.curveMonotoneX);

    //선그래프 추가
    const rxLinePath = graphGroup.selectAll(".rx-line-path").data([data]);
    rxLinePath
      .enter()
      .append("path")
      .attr("class", "rx-line-path")
      .merge(rxLinePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValues[0] + "90")
      .attr("stroke-width", 2)
      .attr("d", rxLineGenerator);

    rxLinePath.exit().remove();

    const txLinePath = graphGroup.selectAll(".tx-line-path").data([data]);
    txLinePath
      .enter()
      .append("path")
      .attr("class", "tx-line-path")
      .merge(txLinePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValues[1] + "90")
      .attr("stroke-width", 2)
      .attr("d", txLineGenerator);

    txLinePath.exit().remove();

    //data point 각 value의 점
    const rxPoints = graphGroup.selectAll(".rx-data-point").data(data);
    rxPoints
      .enter()
      .append("circle")
      .attr("class", "rx-data-point")
      .merge(rxPoints)
      .transition()
      .duration(500)
      .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.rxData))
      .attr("r", 4)
      .attr("fill", colorValues[0]);

    rxPoints.exit().remove();

    const txPoints = graphGroup.selectAll(".tx-data-point").data(data);
    txPoints
      .enter()
      .append("circle")
      .attr("class", "tx-data-point")
      .merge(txPoints)
      .transition()
      .duration(500)
      .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.txData))
      .attr("r", 4)
      .attr("fill", colorValues[1]);

    txPoints.exit().remove();
  };

  useEffect(() => {
    drawGraph(packetRef, packetData);
  }, [packetData]);

  if (!packetData) {
    return <div className={style.body}>Loading...</div>;
  }

  return (
    <div className={style.body} id="packetbox">
      <h2 className={style.title}>🔌 Daily Interface Usage(Byte)</h2>
      <svg ref={packetRef}></svg>
      <button
        className={style.helpBtn}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <IoMdHelpCircleOutline />
      </button>
      <div
        className={style.helper}
        style={{ display: helperVisible ? "flex" : "none" }}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <p className={style.help}>
        그래프 하나당 하루의 서버 인터페이스(트래픽 등) 사용량을 나타냅니다.
        </p>
        <p className={style.help}>
        트래픽 증가 추이를 파악하여 네트워크 자원을 효율적으로 관리할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default TotalPacket;
