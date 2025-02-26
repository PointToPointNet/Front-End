import { useState } from "react";
import style from "../styles/total-logs.module.scss";
import { IoMdHelpCircleOutline } from "react-icons/io";
interface CriticalErrData {
  server_id: number;
  log_time: string;
  service: string;
  log_level: string;
  message: string;
}

interface TotalLogsProps {
  criticalErrData: CriticalErrData[];
}

const TotalLogs: React.FC<TotalLogsProps> = ({ criticalErrData }) => {
  const [helperVisible, setHelperVisible] = useState(false);

  if (!criticalErrData) {
    return <div className={style.body}>Loading...</div>;
  }
  return (
    <div className={style.body}>
      <h2>🚨 Weekly Critical Error Log Status</h2>
      <div className={style.tableHeader}>
        <div>LOG_TIME</div>
        <div>SERVICE</div>
        <div>LOG_LEVEL</div>
        <div>MESSAGE</div>
      </div>
      <div className={style.container}>
        {criticalErrData.map((data, index) => {
          return (
            <div key={index} className={style.tableBody}>
              <div>
                {data.log_time.split("T")[0]}{" "}
                {data.log_time.split("T")[1].substring(0, 8)}
              </div>
              <div>{data.service}</div>
              <div>{data.log_level}</div>
              <div>{data.message}</div>
            </div>
          );
        })}
      </div>
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
        <p className={style.help}>
        일주일 동안 발생한 치명적 오류 로그를 순서대로 확인할 수 있습니다.
        </p>
        <p className={style.help}>
        문제가 발생한 시점을 빠르게 파악하고, 근본 원인을 신속히 해결할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default TotalLogs;
