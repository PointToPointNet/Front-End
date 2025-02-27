import { useEffect, useState } from "react";
import style from "../styles/board-status.module.scss";
import BoardStatusMemory from "./Board-status-memory";
import BoardStatusSwap from "./Board-status-swap";
import BoardStatusCpu from "./Board-status-cpu";
import BoardStatusDisk from "./Board-status-disk";
import { IoMdHelpCircleOutline } from "react-icons/io";

import url from "../assets/config/url.ts";

interface BoardStatusProps {
  serverName: string;
}
const BoardStatus: React.FC<BoardStatusProps> = ({ serverName }) => {
  const [usingMemory, setUsingMemory] = useState<number | null>(0);
  const [totalMemory, setTotalMemory] = useState<number | null>(0);
  const [usingSwap, setUsingSwap] = useState<number | null>(0);
  const [totalSwap, setTotalSwap] = useState<number | null>(0);
  const [cpuUtilization, setCpuUtilization] = useState<number | null>(0);
  const [usingDisk, setUsingDisk] = useState<number | null>(0);

  const [helperVisible, setHelperVisible] = useState(false);

  useEffect(() => {
    const fetchData = (): void => {
      fetch(`${url.url}/status`)
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            const serverNameData = Object.keys(data[i])[0];
            // console.log("serverName:", serverName);
            // console.log("serverNameData:", serverNameData);

            if (serverNameData == serverName) {
              const { memory, swap, cpu, disk } = data[i][serverNameData];
              
              const usingMemory = memory.usingMemory;
              const totalMemory = memory.totalMemory;
              const usingSwap = swap.usingSwap;
              const totalSwap = swap.totalSwap;
              const cpuUtilization = parseFloat(cpu.cpuUtilization);
              const usingDisk = Number(disk.diskUtilization.replace("%", ""));
              // console.log(swap)
              setUsingMemory(usingMemory);
              setTotalMemory(totalMemory);
              setUsingSwap(usingSwap);
              setTotalSwap(totalSwap);
              setCpuUtilization(cpuUtilization);
              setUsingDisk(usingDisk);
            }
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    };
    // 맨처음에 불러오기기
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1500);

    return () => clearInterval(interval);
  }, [serverName]);

  return (
    <div className={style.body} id="statusbox">
      <BoardStatusMemory
        usingMemory={usingMemory}
        totalMemory={totalMemory}
      ></BoardStatusMemory>
      <BoardStatusSwap
        usingSwap={usingSwap}
        totalSwap={totalSwap}
      ></BoardStatusSwap>
      <BoardStatusCpu cpuUtilization={cpuUtilization}></BoardStatusCpu>
      <BoardStatusDisk usingDisk={usingDisk}></BoardStatusDisk>
      <button
        className={style.helpBtn}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <IoMdHelpCircleOutline />
      </button>
      <div
        className={style.helper}
        style={{ display: helperVisible ? "flex" : "none" }}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <p className={style.help}>MEMORY: 현재 메모리 사용률을 나타냅니다.</p>
        <p className={style.help}>CPU: 현재 CPU 사용률을 나타냅니다.</p>
        <p className={style.help}>DISK: 현재 디스크 사용률을 나타냅니다.</p>
      </div>
    </div>
  );
};

export default BoardStatus;
