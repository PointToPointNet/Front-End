import style from '../styles/board-runtime.module.scss';
import { useEffect, useState } from "react";
import { IoMdHelpCircleOutline } from "react-icons/io";

import url from "../assets/config/url.ts";

interface BoardRuntime {
  serverName: string;
}

const BoardRuntime: React.FC<BoardRuntime> = ({ serverName }) => {
  const [helperVisible, setHelperVisible] = useState(false);
  const [runtimeData, setRuntimeData] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    // setInterval을 setTimeout으로 변경.
    const fetchData = () => {
      fetch(`${url.url}/runtime`)
        .then((response) => response.json())
        .then((runtimeData) => {
          const server_runtime = runtimeData.find((server_sep: { [key: string]: number }) => serverName in server_sep);
          const runtime = server_runtime[serverName]["runtime"];
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
  }, [serverName]);


  const addZero = (value) => {
    if (value < 10) {
      return `0${value}`;
    } else {
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
      <button className={style.helpBtn} onClick={()=>{setHelperVisible(!helperVisible)}}><IoMdHelpCircleOutline /></button>
      <div className={style.helper} style={{ display: helperVisible ? "flex" : "none" }}>
        <p className={style.help}>서버가 구동된 후 얼마나 지났는지 나타내는 데이터입니다.</p>
      </div>
    </div>
  );
};

export default BoardRuntime;
