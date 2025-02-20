import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-status.module.scss";

interface MemoryData {
  usingMemory: number;
  totalMemory: number;
}


const BoardStatus: React.FC = () => {
  const [memoryData, setMemoryData] = useState<MemoryData | null>(null); // 메모리 데이터
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // 주기적으로 메모리 데이터를 가져오는 함수
    const interval = setInterval(() => {
      fetch("http://localhost:3000/memory")
        .then((response) => response.json())
        .then((data: MemoryData) => {
          setMemoryData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      // CPU 데이터 및 디스크 데이터도 여기에 추가 가능
    }, 3000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  useEffect(() => {
    if (!svgRef.current || !memoryData) return;

    const { usingMemory, totalMemory } = memoryData;


    // 기존 내용 제거하고 svg초기화
    d3.select(svgRef.current).selectAll("*").remove();

    // 사용량과 남은 용량 ()
    const data = [usingMemory, totalMemory - usingMemory]; 
    const width = 250;
    const height = 180;
    const radius = Math.min(width, height) / 2;

    // SVG 설정
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 색상
    const color = d3.scaleOrdinal(["orange", "#36434E"]);

    // pie
    const pie = d3.pie<number>().value((d) => d)
    .sort(null)
    .startAngle(-Math.PI / 2) // 부채꼴 시작 각도 (위쪽 기준)
    .endAngle(Math.PI / 2); // 부채꼴 끝 각도 (아래쪽 기준)
    const arcData = pie(data);

    // arc
    const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(60).outerRadius(radius);

    // add pie!
    svg
      .selectAll("path")
      .data(arcData)
      .join("path")
      .attr("d", arc as any) 
      .attr("fill", (_, i) => color(i.toString()))
      .attr("stroke-width", 2);

  }, [memoryData]); // memoryData가 변경될 때마다 실행

  return (
    <div className={style.body}>
      <div className={style.memory}>
        <h2>MEMORY</h2>
        <svg ref={svgRef}></svg>
      </div>
      <div className={style.cpu}>
        <h2>CPU</h2>
        {/*<svg ref={svgRef}></svg>*/}
      </div>
      <div className={style.disk}>
        <h2>DISK</h2>
        {/*<svg ref={svgRef}></svg>*/}
      </div>
    </div>
  );
};

export default BoardStatus;
