// 메모리 사용량, cpu 사용량, 디스크 사용량 등 수치를 나타내는 컴포넌트
import { useEffect, useState } from "react";
import status from '../styles/board-status.module.scss';

interface MemoryData {
  usingMemory: number;
  totalMemory: number;
}

const BoardStatus: React.FC = () => {

  const [memoryData, setMemoryData] = useState<MemoryData | null>(null); //메모리데이터

  useEffect(() => {
    const interval = setInterval(() => {

      //메모리 데이터
      fetch('http://localhost:3000/memory')
        .then((response) => response.json()) 
        .then((data: MemoryData) => {
          setMemoryData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error); 
        });

        // cpu 데이터

        // 디스크 데이터
        

    }, 3000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className={status.body}>
      <div className={status.memory}>
        <h1>메모리</h1>
          <p>{JSON.stringify(memoryData, null, 2)}</p>
      </div>
      <div className={status.cpu}>
        <h1>CPU</h1>
          <p>{JSON.stringify(memoryData, null, 2)}</p>
      </div>
      <div className={status.disk}>
        <h1>디스크</h1>
          <p>{JSON.stringify(memoryData, null, 2)}</p>
      </div>

    </div>
  )
}

export default BoardStatus;