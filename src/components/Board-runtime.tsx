import style from '../styles/Board-runtime.module.scss';
import { useEffect, useState } from "react";

const BoardRuntime: React.FC = () => {
  
  interface Runtime {
    test: { runtime: number };
  }
  type RuntimeResponse = Runtime[];

  const [runtimeData, setRuntimeData] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3000/runtime")
        .then((response) => response.json())
        .then(([{ test: { runtime } }]: RuntimeResponse) => {
          setRuntimeData(runtime);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.body}>
      <h2 className={style.title}>RUN TIME</h2>
      <p className={style.contents}>{runtimeData !== null ? `${Math.floor(runtimeData / 60 / 24)}d : ${Math.floor(runtimeData / 60)}h : ${runtimeData % 60}m` : "Loading..."}</p>
    </div>
  );
};

export default BoardRuntime;
