// 포트사용현황, 활성포트 확인 컴포넌트트
import { useEffect, useState, useRef } from "react";

import * as d3 from "d3";
import { FaRegCircleStop } from "react-icons/fa6";
import { IoAlertCircle } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import style from '../styles/board-ports.module.scss';
import BoardPortsGraph from './Board-ports-graph';
import Popup from './Popup';
import { IoMdHelpCircleOutline } from "react-icons/io";

import url from "../assets/config/url.ts";

interface BoardPortsProps {
  serverName: string;
}

interface portData {
  port: string;
  count: number;
}

interface PortType {
  type1: number;
  type2: number;
  type3: number;
}

interface portData {
  protocol: string;
  address: string;
}


const BoardPorts: React.FC<BoardPortsProps> = ({serverName}) => {
const [helperVisible, setHelperVisible] = useState(false);
const [activePortList, setActivePortList] = useState<portData[]>([]);
const [visible, setVisible] = useState(false);
const propsServerName = serverName

const fetchActivePort = () => {
  fetch(`${url.url}/active_port`)
    .then((response) => response.json())
    .then((data) => {
      for (let i=0; i<data.length; i++) {
        const serverNameData =  Object.keys(data[i])[0];
        const portData = data[i][serverNameData]
        // console.log(portData)
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
}

  useEffect(() => {
    //최초 실행
    fetchActivePort();
    //1분마다 실행
    const interval = setInterval(() => {
      fetchActivePort();
    }, 60000);
    return () => clearInterval(interval);
  }, [serverName]);

  const [ delIndex, setDelIndex ] = useState(0)

  const processDown = ()=> {
    const selectedPort = activePortList[delIndex].address
    const regex = selectedPort.match(/:(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5]?[0-9]{1,4})/g)
    // const disconnectPort = regex[0].replace(":","")
    // console.log(disconnectPort)
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
      <BoardPortsGraph propsServerName={propsServerName}></BoardPortsGraph>
      
      <div className={style.body}>
        <h2 className={style.title}>Active Port TOP 4</h2>
        <ul className={style.list}>
          {activePortList.map((port, index) => (
            <li key={index}>
              <div className={style.status}>
                <div className={style.circle}></div>
              </div>
              <div className={style.protocol}>{port.protocol}</div>
              <div className={style.ip}>{port.address}</div>
              <div className={style.button}><button id={"btn"+index} onClick={(e) => {setVisible(!visible), setDelIndex(Number(e.target.id.substring(3)))}}>
              <FaRegCircleStop />
              </button></div>
            </li>
          ))}
          <div className={style.modal} style={{
            display: visible ? "block" : "none"
          }}>
            <div className={style.popup}>
              <p>포트를 <span>비활성화</span> 하시겠습니까?</p>
              <p>해당 포트를 사용하는 모든 프로세스의 연결이 끊깁니다.</p>
              <p className={style.popupBtn}>
                <button onClick={() => {setVisible(!visible)}}>Cancel</button>
                <button onClick={() => {processDown(), setVisible(!visible)}}>Yes, Disconnect</button>
              </p>
              <div className={style.alert}><IoAlertCircle /></div>
              <div className={style.close} onClick={() => setVisible(null)}><IoClose /></div>
            </div>
          </div>
        </ul>
        <button className={style.helpBtn} onClick={()=>{setHelperVisible(!helperVisible)}}><IoMdHelpCircleOutline /></button>
        <div className={style.helper} style={{ display: helperVisible ? "flex" : "none" }} onClick={()=>{setHelperVisible(!helperVisible)}}>
          <p className={style.help}>PORT는 컴퓨터가 외부와 통신할 때 사용하는 통로(문)입니다.</p>
          <p className={style.help}>Active Port 는 현재 사용 중인 ip 및 port들을 나타냅니다.</p>
        </div>
      </div>
      
    </div>
  )
  

}

export default BoardPorts;