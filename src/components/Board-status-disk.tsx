import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface BoardStatusDiskProps {
  usingDisk: number | null;
  totalDisk: number | null;
}

const BoardStatusDisk: React.FC<BoardStatusDiskProps> = (props) => {
  const { usingDisk, totalDisk } = props;
  const diskSvgRef = useRef<SVGSVGElement | null>(null);
  console.log("disk: " + usingDisk, totalDisk)
  let percent: string | number = 0;
  if (usingDisk !== null && totalDisk !== null) {
    percent = (Math.round((usingDisk / totalDisk) * 100 * 10) / 10).toFixed(1);
  }

  useEffect(() => {
    if (!diskSvgRef.current || usingDisk === null || totalDisk === null) return;
    // console.log(usingDisk, totalDisk)
    const data = [usingDisk, totalDisk - usingDisk];
    const width = parseInt(d3.select('#diskbox').style('width'), 10) - 35;
    const height = 180;
    const radius = Math.min(width, height) / 2;

    d3.select(diskSvgRef.current).selectAll("*").remove();

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
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const diskArcData = diskPie(data);

    const diskArc = d3.arc<d3.PieArcDatum<number>>().innerRadius(radius-25).outerRadius(radius);

    diskSvg
      .selectAll("path")
      .data(diskArcData)
      .join("path")
      .attr("d", diskArc as never)
      .attr("fill", (_, i) => diskColor(i.toString()))
      .attr("stroke-width", 2);
  }, [usingDisk, totalDisk]);

  const totalDiskSize = totalDisk ? totalDisk / (2**20) : 0;

  if (usingDisk === null || totalDisk === null ) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.disk} id="diskbox">
      <h2 className={style.title}>disk</h2>
      <p className={style.data}>
        {!percent ? 0 : percent } %
        <span>{(usingDisk / (2**20)).toFixed(1)}GB / {(totalDiskSize > 1000 ? (totalDiskSize / (2**10)).toFixed(1) + "TB" : totalDiskSize.toFixed(1) + "GB")}</span>
      </p>
      <svg ref={diskSvgRef}></svg>
    </div>
  );
};


export default BoardStatusDisk;
