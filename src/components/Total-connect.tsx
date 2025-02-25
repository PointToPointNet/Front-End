import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/total-connect.module.scss";
import { IoMdHelpCircleOutline } from "react-icons/io";

interface WebConnectData {
  date: string;
  value: number;
}
interface TotalConnectProps {
  webConnectData: WebConnectData[];
}

const TotalConnect: React.FC<TotalConnectProps> = ({ webConnectData }) => {
  const connectRef = useRef<SVGSVGElement | null>(null);
  const colorValue = "#FBB214";

  const [helperVisible, setHelperVisible] = useState(false);

  const drawGraph = (
    svgRef: React.RefObject<SVGSVGElement>,
    data: WebConnectData[],
    title: string
  ) => {
    if (!svgRef.current || data.length === 0) return;

    // 그래프의 크기 세팅
    const width = parseInt(d3.select("#connectbox").style("width"), 10) - 20;
    const height = 240;
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
      .padding(0.6);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 100])
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
      .call(d3.axisBottom(xScale).tickFormat((d, i) => data[+d]?.date))
      .style("stroke", "#aaa");

    //y축입니다
    graphGroup.select(".y-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(10))
      .style("stroke", "#aaa");

    // 가로 보조선 추가
    const gridLines = graphGroup.selectAll(".grid-line").data(yScale.ticks(10)); // Y축 눈금 기준으로 보조선 추가
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

    //막대그래프 생성
    const bars = graphGroup.selectAll(".bar").data(data);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (_, i) => xScale(i.toString()) || 0)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", colorValue + "70"); // Bar color

    bars.exit().remove();

    //선그래프 생성
    const lineGenerator = d3
      .line<WebConnectData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.value)) // Y축 좌표
      .curve(d3.curveMonotoneX); // 부드러운 곡선

    //선그래프 추가
    const linePath = graphGroup.selectAll(".line-path").data([data]);
    linePath
      .enter()
      .append("path")
      .attr("class", "line-path")
      .merge(linePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValue + "90")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    linePath.exit().remove();

    //data point 각 value의 점
    const points = graphGroup.selectAll(".data-point").data(data);
    points
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .merge(points)
      .transition()
      .duration(500)
      .attr(
        "cx",
        (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2
      )
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4) // 점의 크기
      .attr("fill", colorValue);

    points.exit().remove();
  };

  useEffect(() => {
    drawGraph(connectRef, webConnectData, "webconnect");
  }, [webConnectData]);

  if (!webConnectData) {
    return <div className={style.body}>Loading...</div>;
  }
  return (
    <div className={style.body} id="connectbox">
      <h2 className={style.title}>🌐Daily Website Visitor Count</h2>
      <svg ref={connectRef}></svg>
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
        그래프 하나당 하루의 웹사이트 방문자 수를 표시합니다.
        </p>
        <p className={style.help}>
        일자별 트래픽 변동을 파악하는 데 도움이 됩니다.
        </p>
      </div>
    </div>
  );
};

export default TotalConnect;
