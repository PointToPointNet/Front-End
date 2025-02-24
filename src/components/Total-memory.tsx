import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/total-memory.module.scss";

interface MemoryData {
  date: string;
  value: number;
}

interface TotalMemoryProps {
  memData: MemoryData[];
}

const TotalMemory: React.FC<TotalMemoryProps> = ({ memData }) => {

const tempData = [
    { date: "2022-01-01", value: 70 },
    { date: "2022-01-02", value: 55 },
    { date: "2022-01-03", value: 88 },
    { date: "2022-01-04", value: 22 },
    { date: "2022-01-05", value: 33 },
    { date: "2022-01-06", value: 44 },
    { date: "2022-01-07", value: 77 },
]; //임시데이터(나중에 tempData를 memData로 변경합니다)

const memRef = useRef<SVGSVGElement | null>(null);




const drawGraph = (
    svgRef: React.RefObject<SVGSVGElement>, 
    data: MemoryData[], 
    title: string
    ) => {
    if (!svgRef.current || data.length === 0) return;
 
    // 그래프의 크기 세팅
    const width = 530;
    const height = 240;
    const margin = { top: 20, right:40, bottom: 20, left: 30 };
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  


    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 100]) // Math.max 제거
      .nice()
      .range([innerHeight, 0]);
 

    let graphGroup = svg.select(".graph-group");
    if (graphGroup.empty()) {
      graphGroup = svg.append("g").attr("class", "graph-group").attr("transform", `translate(${margin.left}, ${margin.top})`).style("stroke", "#aaa");;
    }

    //x축입니다 
    graphGroup.select(".x-axis").remove();
    graphGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(data.length).tickFormat((d, i) => data[i]?.date))
      .style("stroke", "#aaa");
  
    //y축입니다
    graphGroup.select(".y-axis").remove();
    graphGroup.append("g")
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




  
    //선그래프 생성 
    const lineGenerator = d3
    .line<MemoryData>()
    .x((_, i) => xScale(i)) // X축 좌표
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
    .attr("stroke", "#564499")
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
    .attr("cx", (_, i) => xScale(i))
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 4) // 점의 크기
    .attr("fill", "#BE9CF4");

    points.exit().remove();
  

  };
  

  useEffect(() => {
    drawGraph(memRef, tempData, "memory");
  }, []);














  if (!memData) {
    //return <div className={style.body}>Loading...</div>;
  }
  return (
    <div className={style.body}>
      <h2 className={style.title}>total mem.</h2>
      <div>
        <svg ref={memRef}></svg>
        {/* {tempData.map((data, index) => (
          <div key={index}>
            <span>{data.date}</span>: <span>{data.value}</span>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default TotalMemory;
