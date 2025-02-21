import { useEffect, useState } from "react";
import style from "../styles/board-status.module.scss";
import BoardStatusMemory from './Board-status-memory'
import BoardStatusCpu from './Board-status-cpu'
import BoardStatusDisk from './Board-status-disk'


const BoardStatus: React.FC = () => {
  const [usingMemory, setUsingMemory] = useState<number | null>(0);
  const [totalMemory, setTotalMemory] = useState<number | null>(0);
  const [cpuUtilization, setCpuUtilization] = useState<number | null>(0);
  const [usingDisk, setUsingDisk] = useState<number | null>(0);
  useEffect(() => {


    const interval = setInterval(() => {
      fetch("http://localhost:3000/status")
      .then((response) => response.json())
      .then((data) => {
        const { memory, cpu, disk } = data[0].test;

        const usingMemory = memory.usingMemory;
        const totalMemory = memory.totalMemory;
        const cpuUtilization = parseFloat(cpu.cpuUtilization);
        const usingDisk = disk.usingDisk;

        setUsingMemory(usingMemory);
        setTotalMemory(totalMemory);
        setCpuUtilization(cpuUtilization);
        setUsingDisk(usingDisk);
        console.log(usingMemory, totalMemory, cpuUtilization, usingDisk)
      })
      .catch((error) => console.error("Error fetching data:", error));
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  
  return (
    <div className={style.body}>
      <BoardStatusMemory usingMemory={usingMemory} totalMemory={totalMemory}></BoardStatusMemory>
      <BoardStatusCpu cpuUtilization={cpuUtilization}></BoardStatusCpu>
      <BoardStatusDisk usingDisk={usingDisk}></BoardStatusDisk>
    </div>
  );
};

export default BoardStatus;