import style from '../styles/Board-runtime.module.scss';
import { useEffect, useState } from "react";

const BoardRuntime: React.FC = () => {
  
  interface Runtime {
    test: { runtime: number };
  }
  type RuntimeResponse = Runtime[];

  const [runtimeData, setRuntimeData] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // setInterval을 setTimeout으로 변경.
    const fetchData = () => {
      fetch("http://localhost:3000/runtime")
        .then((response) => response.json())
        .then(([{ test: { runtime } }]: RuntimeResponse) => {
          setRuntimeData(runtime);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          // setInterval처럼 사용할 수 있도록...
          timeoutId = setTimeout(fetchData, 1000);
        });
    }

    fetchData(); // 최초에 실행해서 처음 값이 일단 나오도록 세팅

    return () => clearTimeout(timeoutId); 
  }, []);

  
  const addZero = (value) => {
    if(value<10){
      return `0${value}`;
    }else{
      return value;
    }
  }
    
  

  return (
    <div className={style.body}>
      <h2 className={style.title}>RUN TIME</h2>
      <div className={style.timebox}>
        <div className={style.time}>
        {`${addZero(Math.floor(runtimeData / 60 - (24 * Math.floor(runtimeData / 60 / 24))))}:${addZero(runtimeData % 60)}`} 
        </div>
        <div className={style.day}>
          {`${Math.floor(runtimeData / 60 / 24)} days`}
        </div>
      </div>
      {/* <p className={style.contents}>{runtimeData !== null ? `${Math.floor(runtimeData / 60 / 24)}d : ${Math.floor(runtimeData / 60 - (24 * Math.floor(runtimeData / 60 / 24)))}h : ${runtimeData % 60}m` : "Loading..."}</p> */}
    </div>
  );
};

export default BoardRuntime;
