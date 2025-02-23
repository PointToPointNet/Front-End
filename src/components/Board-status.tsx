import { useEffect, useState } from "react";
import style from "../styles/board-status.module.scss";
import BoardStatusMemory from './Board-status-memory'
import BoardStatusCpu from './Board-status-cpu'
import BoardStatusDisk from './Board-status-disk'

interface BoardStatusProps {
  serverName: string;
}
const BoardStatus: React.FC<BoardStatusProps> = ({serverName}) => {
  const [usingMemory, setUsingMemory] = useState<number | null>(0);
  const [totalMemory, setTotalMemory] = useState<number | null>(0);
  const [cpuUtilization, setCpuUtilization] = useState<number | null>(0);
  const [usingDisk, setUsingDisk] = useState<number | null>(0);

  useEffect(() => {
    // 맨처음에 불러오기기
    fetch("http://localhost:3000/status")
    .then((response) => response.json())
    .then((data) => {
      for(let i=0; i<data.length; i++){
        const serverNameData = Object.keys(data[i])[0];
        console.log("serverName:", serverName);
        console.log("serverNameData:", serverNameData);

        if(serverNameData == serverName) {
          const { memory, cpu, disk } = data[i][serverNameData];
          const usingMemory = memory.usingMemory;
          const totalMemory = memory.totalMemory;
          const cpuUtilization = parseFloat(cpu.cpuUtilization);
          const usingDisk = Number(disk.diskUtilization.replace('%', ''));

          setUsingMemory(usingMemory);
          setTotalMemory(totalMemory);
          setCpuUtilization(cpuUtilization);
          setUsingDisk(usingDisk);
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

    //3초마다 실행
    const interval = setInterval(() => {
      fetch("http://localhost:3000/status")
      .then((response) => response.json())
      .then((data) => {
        for(let i=0; i<data.length; i++){
          const serverNameData = Object.keys(data[i])[0];
          console.log(serverNameData)
          if(serverNameData === serverName) {
            const { memory, cpu, disk } = data[i][serverNameData];
            const usingMemory = memory.usingMemory;
            const totalMemory = memory.totalMemory;
            const cpuUtilization = parseFloat(cpu.cpuUtilization);
            const usingDisk = Number(disk.diskUtilization.replace('%', ''));
  
            setUsingMemory(usingMemory);
            setTotalMemory(totalMemory);
            setCpuUtilization(cpuUtilization);
            setUsingDisk(usingDisk);
          }
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
    }, 3000);

    return () => clearInterval(interval);
  }, [serverName]);

  
  return (
    <div className={style.body}>
      <BoardStatusMemory usingMemory={usingMemory} totalMemory={totalMemory}></BoardStatusMemory>
      <BoardStatusCpu cpuUtilization={cpuUtilization}></BoardStatusCpu>
      <BoardStatusDisk usingDisk={usingDisk}></BoardStatusDisk>
    </div>
  );
};

export default BoardStatus;