import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from '../styles/board-ports.module.scss';

const BoardPortsGraph = () => {

  const [portType, setPortType] = useState<PortType | null>({
    type1: 30,
    type2: 44, 
    type3: 23
  }); 

  const svgRef = useRef<SVGSVGElement | null>(null);
  
  
  useEffect(() => {
    if (!svgRef.current || !portType) return;
  
    const { type1, type2, type3 } = portType;
  
  
    // 기존 내용 제거하고 svg초기화
    d3.select(svgRef.current).selectAll("*").remove();
  
    // 사용량과 남은 용량 ()
    const data = [ type1, type2, type3 ]; 
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;
  
    // SVG 설정
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    // 색상
    const color = d3.scaleOrdinal(["#9747FF", "#B91293","#FFD7A3"]);
  
    // pie
    const pie = d3.pie<number>().value((d) => d)
    .sort(null)
    .startAngle(-Math.PI) // 부채꼴 시작 각도 (위쪽 기준)
    .endAngle(Math.PI); // 부채꼴 끝 각도 (아래쪽 기준)
    const arcData = pie(data);
  
    // arc
    const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(65).outerRadius(radius);
  
    // add pie!
    svg
      .selectAll("path")
      .data(arcData)
      .join("path")
      .attr("d", arc as any) 
      .attr("fill", (_, i) => color(i.toString()))
      .attr("stroke-width", 2);
  
  }, [portType]); // memoryData가 변경될 때마다 실행

  return (<div className={style.body}>
    <h2 className={style.title}>Port Type</h2>
    <svg ref={svgRef}></svg>
  </div>)
}


export default BoardPortsGraph;