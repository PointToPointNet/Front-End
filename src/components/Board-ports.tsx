// 포트사용현황, 활성포트 확인 컴포넌트트
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from '../styles/board-ports.module.scss';


interface PortType {
  type1: number;
  type2: number;
  type3: number;
}

interface BoardPortsProps {
  serverName: string;
}

interface portData {
  protocol: string;
  address: string;
}

const BoardPorts: React.FC<BoardPortsProps> = ({serverName}) => {

const [activePortList, setActivePortList] = useState<portData[]>([]);
const [visible, setVisible] = useState(false);

  useEffect(() => {
    //최초 실행
    fetch("http://localhost:3000/active_port")
    .then((response) => response.json())
    .then((data) => {
      for (let i=0; i<data.length; i++) {
        const serverNameData =  Object.keys(data[i])[0];
        const portData = data[i][serverName]
        console.log(portData)
        if (serverNameData === serverName) {
          const ports = portData.map((port: portData) => ({
            protocol: port.protocol,
            address: port.address,
          }));
          setActivePortList(ports);
          break;
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

    //1분마다 실행
    const interval = setInterval(() => {
      fetch("http://localhost:3000/active_port")
      .then((response) => response.json())
      .then((data) => {
        for (let i=0; i<data.length; i++) {
          const serverNameData = data[i][serverName];
          if (serverNameData) {
            const ports = serverNameData.map((port: portData) => ({
              protocol: port.protocol,
              address: port.address,
            }));
            setActivePortList(ports);
            break;
          }
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
    }, 60000);
    return () => clearInterval(interval);
  }, [serverName]);

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



  const [ delIndex, setDelIndex ] = useState(0)

  const processDown = ()=> {
    const selectedPort = activePortList[delIndex].address
    const regex = selectedPort.match(/:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5]?[0-9]{1,4})/g)
    const disconnectPort = regex[0].replace(":","")
    console.log(disconnectPort)
    const newActivePortList = [...activePortList.slice(0, delIndex), ...activePortList.slice(delIndex + 1)];
    setActivePortList(newActivePortList)
    //user_list와 방식은 같음음
    //const { exec } = require("child_process");

    // const disconnectUser = (username) => {
    //   exec(`sudo netstat -tulnp | grep ${disconnectPort}` 혹은 `sudo fuser -k ${disconnectPort}/tcp` , (err, stdout, stderr) => {
    //     if (err) {
    //       console.error("Error disconnecting port:", stderr);
    //       return;
    //     }
    //     console.log(`${disconnectPort} disconnected successfully.`);
    //   });
    // };

    // // 예시: 특정 사용자의 접속 종료
    // disconnectUser("username");
    //x 버튼 클릭시 리스트에서 제거 후 서버에 요청 => 서버(백백)에서 특정 포트를 사용하는 프로세스를 죽일 수 있음 => 백에서 json 새로 업데이트 => 프론트 자동 반영영

  }

  return (
    <div className={style.portsbody}>
      <div className={style.body}>
        <h2 className={style.title}>Port Type</h2>
        <svg ref={svgRef}></svg>
      </div>
      <div className={style.body}>
        <h2 className={style.title}>Active Ports</h2>
        <ul className={style.list}>
          {activePortList.map((port, index) => (
            <li key={index}>
              <div className={style.status}>
                <div className={style.circle}></div>
              </div>
              <div className={style.protocol}>{port.protocol}</div>
              <div className={style.ip}>{port.address}</div>
              <div className={style.button}><button id={"btn"+index} onClick={(e) => {setVisible(!visible), setDelIndex(Number(e.target.id.substring(3)))}}>❌</button></div>
              <div className={style.popup} style={{
                display: visible ? "flex" : "none"
              }}>
                <p>포트를 비활성화 하시겠습니까?</p>
                <p>해당 포트를 사용하는 모든 프로세스의 연결이 끊깁니다.</p>
                <p className={style.popupBtn}><button onClick={() => {processDown(), setVisible(!visible)}}>⭕</button><button onClick={() => {setVisible(!visible)}}>❌</button></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
  

}

export default BoardPorts;