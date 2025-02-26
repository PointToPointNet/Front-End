import style from "../styles/all-total-memory.module.scss"
import { IoMdHelpCircleOutline } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";


interface MemData {
  [key: string]: { [serverName: string]: number };
}


const AllTotalMemory: React.FC<MemData> = ({ memData }) => {
  const memoryRef = useRef<SVGSVGElement | null>(null);

  const colorValues = ["#0c9b5d", "#135E93", "#e33535", "#1a9aae", "#da7421"]; // 서버별 색상
  const [helperVisible, setHelperVisible] = useState(false);


  // 새로운 데이터 구조
  // const memData: MemData[]

  const drawGraph = (svgRef: React.RefObject<SVGSVGElement>, data: MemData) => {
    if (!svgRef.current || Object.keys(data).length === 0) return;

const width = parseInt(d3.select("#memorybox").style("width"), 10) - 20;
    const height = 300;
    const margin = { top: 30, right: 40, bottom: 20, left: 30 };
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 날짜와 서버 이름 추출
    const dates = Object.keys(data);
    const servers = Object.keys(data[dates[0]]);

    // x축 스케일 설정 (날짜)
    const xScale = d3
      .scaleBand()
      .domain(dates)
      .range([0, innerWidth])
      .padding(0.2);

    // y축 스케일 설정 (값 범위)
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dates.flatMap((date) => Object.values(data[date]))) || 100,
      ])
      .nice()
      .range([innerHeight, 0]);

    let graphGroup = svg.select(".graph-group");
    if (graphGroup.empty()) {
      graphGroup = svg
        .append("g")
        .attr("class", "graph-group")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    }

    // x축 생성
    graphGroup.select(".x-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d))
      .selectAll("text")
      // .attr("transform", "rotate(45)")
      .style("text-anchor", "center");

    // y축 생성
    graphGroup.select(".y-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(10));

    // 가로 보조선 추가
    const gridLines = graphGroup.selectAll(".grid-line").data(yScale.ticks(10));
    gridLines
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .merge(gridLines)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4");

    gridLines.exit().remove();

    // 각 서버에 대해 선 그래프 생성
    servers.forEach((serverName, index) => {
      const serverData = dates.map((date) => ({
        date,
        value: data[date][serverName],
      }));

      const lineGenerator = d3
        .line<{ date: string; value: number }>()
        .x((d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.value))
        .curve(d3.curveMonotoneX);

      // 선 그래프 추가
      const linePath = graphGroup.selectAll(`.line-path-${serverName}`).data([serverData]);
      linePath
        .enter()
        .append("path")
        .attr("class", `line-path-${serverName}`)
        .merge(linePath)
        .transition()
        .duration(500)
        .attr("fill", "none")
        .attr("stroke", colorValues[index % colorValues.length]) // 서버별 색상 적용
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

      linePath.exit().remove();

      // 데이터 포인트 추가 (각 점 표시)
      const points = graphGroup.selectAll(`.data-point-${serverName}`).data(serverData);
      points
        .enter()
        .append("circle")
        .attr("class", `data-point-${serverName}`)
        .merge(points)
        .transition()
        .duration(500)
        .attr(
          "cx",
          (d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2
        )
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 4)
        .attr("fill", colorValues[index % colorValues.length]);

      points.exit().remove();
    });
  };

  useEffect(() => {
    drawGraph(memoryRef, memData); // 새로운 데이터 전달
  }, [memData]);

  return (
    <div className={style.body} id="memorybox">
      <h2 className={style.title}>💻 Daily Memory Usage(%) </h2>
      <svg ref={memoryRef}></svg>
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
          각 서버별 Memory 사용량을 한눈에 보여줍니다.
        </p>
     
      </div>
    </div>
  );
};

export default AllTotalMemory;