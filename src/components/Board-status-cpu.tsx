import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface BoardStatusCpuProps {
  cpuUtilization: number | null;
}

const BoardStatusCpu: React.FC<BoardStatusCpuProps> = ({ cpuUtilization }) => {
  const cpuSvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!cpuSvgRef.current || cpuUtilization === null) return;

    d3.select(cpuSvgRef.current).selectAll("*").remove();

    const width = 250;
    const height = 180;
    const radius = Math.min(width, height) / 2;
    const cpuUsage = cpuUtilization;
    const remaining = 100 - cpuUsage;

    const data = [cpuUsage, remaining];
    const color = d3.scaleOrdinal(["#ff4d4d", "#36434E"]);

    const cpuSvg = d3
      .select(cpuSvgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<number>()
      .value((d) => d)
      .sort(null)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(60).outerRadius(radius);

    cpuSvg.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc as never)
      .attr("fill", (_, i) => color(i.toString()))
      .attr("stroke-width", 2);
  }, [cpuUtilization]);

  if (cpuUtilization === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.cpu}>
      <h2>CPU</h2>
      <p>{cpuUtilization} %</p>
      <svg ref={cpuSvgRef}></svg>
    </div>
  );
};

export default BoardStatusCpu;
