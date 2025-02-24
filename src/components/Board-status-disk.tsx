import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface BoardStatusDiskProps {
  usingDisk: number | null;
}

const BoardStatusDisk: React.FC<BoardStatusDiskProps> = ({ usingDisk }) => {
  const diskSvgRef = useRef<SVGSVGElement | null>(null);

  let percent = 0;
    if (usingDisk !== null) {
      percent = (usingDisk).toFixed(1);
    }
  useEffect(() => {
    if (!diskSvgRef.current || usingDisk === null) return;

    

    d3.select(diskSvgRef.current).selectAll("*").remove();

    const data = [usingDisk, 100 - usingDisk];
    const width = parseInt(d3.select('#diskbox').style('width'), 10) - 20;
    const height = 180;
    const radius = Math.min(width, height) / 2;

    // SVG 설정
    const diskSvg = d3
      .select(diskSvgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const diskColor = d3.scaleOrdinal(["#FF6060", "#36434E"]);


    const diskPie = d3.pie<number>()
      .value((d) => d)
      .sort(null)
      .startAngle(-Math.PI / 2) // 반원 시작 각도
      .endAngle(Math.PI / 2); // 반원 끝 각도
    
    const diskArcData = diskPie(data);

    // arc 설정
    const diskArc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(radius-25)
      .outerRadius(radius);

    diskSvg
      .selectAll("path")
      .data(diskArcData)
      .join("path")
      .attr("d", diskArc as never)
      .attr("fill", (_, i) => diskColor(i.toString()))
      .attr("stroke-width", 2);
  }, [usingDisk]);

  return (
    <div className={style.disk} id="diskbox">
      <h2 className={style.title}>DISK</h2>
      <p className={style.data}>{percent} %</p>
      <svg ref={diskSvgRef}></svg>
    </div>
  );
};

export default BoardStatusDisk;