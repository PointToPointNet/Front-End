// 포트사용현황, 활성포트 확인 컴포넌트트
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from '../styles/board-ports.module.scss';

interface BoardPortsGraphProps {
  propsServerName: string;
}

interface portData {
  port: string;
  count: number;
}

interface PortType {
  type1: number;
  type2: number;
  type3: number;
  type4: number;
}

const BoardPortsGraph: React.FC<BoardPortsGraphProps> = ({propsServerName}) => {
  const [usedPortList, setUsedPortList] = useState<portData[]>([]);
  const [usedPortTop4, setUsedPortTop4] = useState<portData[]>([]);
  const [portType, setPortType] = useState<PortType | null>({
    type1: 30,
    type2: 44, 
    type3: 23,
    type4: 10
  }); 
  const svgRef = useRef<SVGSVGElement | null>(null);
  const serverName = propsServerName
  


  const fetchUsedPort = () => {
    fetch("http://localhost:3000/used_port")
      .then((response) => response.json())
      .then((data) => {
        for (let i=0; i<data.length; i++) {
          const serverNameData =  Object.keys(data[i])[0];
          const usedPortData = data[i][serverNameData]
          // console.log(usedPortData)
          if (serverNameData === serverName) {

            // console.log(serverName)
            const ports = usedPortData.map((port: portData) => ({
              port: port.port,
              count: Number(port.count),
            }));
            
            const sorting = ports.sort((a, b) => b.count - a.count)
            const top4 = sorting.slice(0, 4);
            console.log(top4)
            setUsedPortTop4(top4)
            setUsedPortList(ports);
            setPortType({type1: top4[0].count, type2: top4[1].count, type3: top4[2].count, type4: top4[3].count})
            break;
          }
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
  
  useEffect(() => {
    //최초 실행
    fetchUsedPort();
    //1분마다 실행
    const interval = setInterval(() => {
      fetchUsedPort();
    }, 60000);
    return () => clearInterval(interval);
  }, [serverName]);

  
  useEffect(() => {
    if (!svgRef.current || !portType) return;
  
    const { type1, type2, type3, type4 } = portType;
  
  
    // 기존 내용 제거하고 svg초기화
    d3.select(svgRef.current).selectAll("*").remove();
  
    // 사용량과 남은 용량 ()
    const data = [ type1, type2, type3, type4 ]; 
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
    const color = d3.scaleOrdinal(["#f72585", "#3a0ca3","#7209b7" ,"#9D43B9"]);
  
    
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
      
      svg
      .selectAll("text") // 포트번호 출력력
      .data(arcData)
      .join("text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .style("fill", "white")
      .style("font-size", "12px")
      .text((d, i) => `:${usedPortList[i]?.port}`);
    
    svg
      .selectAll(".count-text") // 개수 텍스트
      .data(arcData)
      .join("text")
      .attr("class", "count-text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x}, ${y + 12})`;
      })
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text((d) => `${d.value} ea`);

  }, [portType, usedPortTop4]);

  return (
    <div className={style.portsbody}>
      <div className={style.body}>
        <h2 className={style.title}>Port Type</h2>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  )
  

}

export default BoardPortsGraph;