import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface BoardStatusCpuProps {
  cpuUtilization: number | null;
  cpuSpeed: number | null;
}

const BoardStatusCpu: React.FC<BoardStatusCpuProps> = ({ cpuUtilization, cpuSpeed }) => {
  const cpuSvgRef = useRef<SVGSVGElement | null>(null);
  let percent: string | number = 0;
  if (cpuUtilization !== null) {
    percent = (cpuUtilization).toFixed(1);
  }
  useEffect(() => {
    if (!cpuSvgRef.current || cpuUtilization === null) return;

    d3.select(cpuSvgRef.current).selectAll("*").remove();

    const width = parseInt(d3.select('#cpubox').style('width'), 10) - 35;
  
    const height = 180;
    const radius = Math.min(width, height) / 2;
    const cpuUsage = cpuUtilization;
    const remaining = 100 - cpuUsage;

    const data = [cpuUsage, remaining];
    const color = d3.scaleOrdinal(["#1BCB80", "#36434E"]);

    const cpuSvg = d3
      .select(cpuSvgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<number>()
      .value((d) => d)
      .sort(null)
      .startAngle(-Math.PI / 2 )
      .endAngle(Math.PI / 2);

    const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(radius-25).outerRadius(radius);

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
    <div className={style.cpu} id="cpubox">
      <h2 className={style.title}>CPU</h2>
      <p className={style.data}>
        {percent} %
        <span>{(cpuSpeed!/1024).toFixed(1)} GHz</span>
      </p>
      <svg ref={cpuSvgRef}></svg>
    </div>
  );
};

export default BoardStatusCpu;
