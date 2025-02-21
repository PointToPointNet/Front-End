// BoardStatusMemory.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface BoardStatusMemoryProps {
  usingMemory: number | null;
  totalMemory: number | null;
}

const BoardStatusMemory: React.FC<BoardStatusMemoryProps> = (props) => {
  const { usingMemory, totalMemory } = props;
  const memorySvgRef = useRef<SVGSVGElement | null>(null);

  let percent = 0;
  if (usingMemory !== null && totalMemory !== null) {
    percent = Math.round((usingMemory / totalMemory) * 100 * 100) / 100;
  }

  useEffect(() => {
    if (!memorySvgRef.current || usingMemory === null || totalMemory === null) return;

    const data = [usingMemory, totalMemory - usingMemory];
    const width = 250;
    const height = 180;
    const radius = Math.min(width, height) / 2;

    d3.select(memorySvgRef.current).selectAll("*").remove();

    const memorySvg = d3
      .select(memorySvgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const memoryColor = d3.scaleOrdinal(["orange", "#36434E"]);

    const memoryPie = d3.pie<number>()
      .value((d) => d)
      .sort(null)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const memoryArcData = memoryPie(data);

    const memoryArc = d3.arc<d3.PieArcDatum<number>>().innerRadius(60).outerRadius(radius);

    memorySvg
      .selectAll("path")
      .data(memoryArcData)
      .join("path")
      .attr("d", memoryArc as never)
      .attr("fill", (_, i) => memoryColor(i.toString()))
      .attr("stroke-width", 2);
  }, [usingMemory, totalMemory]);

  if (usingMemory === null || totalMemory === null ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.memory}>
      <h2>MEMORY</h2>
      <p className={style.data}>{!percent ? 0 : percent } %</p>
      <svg ref={memorySvgRef}></svg>
    </div>
  );
};


export default BoardStatusMemory;
