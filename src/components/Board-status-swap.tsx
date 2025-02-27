import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface BoardStatusSwapProps {
  usingSwap: number | null;
  totalSwap: number | null;
}

const BoardStatusSwap: React.FC<BoardStatusSwapProps> = (props) => {
  const { usingSwap, totalSwap } = props;
  const swapSvgRef = useRef<SVGSVGElement | null>(null);
  console.log("swap: " + usingSwap, totalSwap)
  let percent: string | number = 0;
  if (usingSwap !== null && totalSwap !== null) {
    percent = (Math.round((usingSwap / totalSwap) * 100 * 10) / 10).toFixed(1);
  }

  useEffect(() => {
    if (!swapSvgRef.current || usingSwap === null || totalSwap === null) return;
    // console.log(usingSwap, totalSwap)
    const data = [usingSwap, totalSwap - usingSwap];
    const width = parseInt(d3.select('#swapbox').style('width'), 10) - 35;
    const height = 180;
    const radius = Math.min(width, height) / 2;

    d3.select(swapSvgRef.current).selectAll("*").remove();

    const swapSvg = d3
      .select(swapSvgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const swapColor = d3.scaleOrdinal(["#2ab2ed", "#36434E"]);

    const swapPie = d3.pie<number>()
      .value((d) => d)
      .sort(null)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const swapArcData = swapPie(data);

    const swapArc = d3.arc<d3.PieArcDatum<number>>().innerRadius(radius-25).outerRadius(radius);

    swapSvg
      .selectAll("path")
      .data(swapArcData)
      .join("path")
      .attr("d", swapArc as never)
      .attr("fill", (_, i) => swapColor(i.toString()))
      .attr("stroke-width", 2);
  }, [usingSwap, totalSwap]);

  if (usingSwap === null || totalSwap === null ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.swap} id="swapbox">
      <h2 className={style.title}>SWAP</h2>
      <div className={style.svgbox}>
        <p className={style.data}>
          {!percent ? 0 : percent } %
          <span>{(usingSwap / (1024)).toFixed(1)} / {(totalSwap / (1024)).toFixed(1)} GB</span>
          </p>
        <svg ref={swapSvgRef}></svg>
      </div>
    </div>
  );
};


export default BoardStatusSwap;
