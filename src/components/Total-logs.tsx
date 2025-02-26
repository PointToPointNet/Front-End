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
  isUTC: boolean;
}

const TotalLogs: React.FC<TotalLogsProps> = ({ criticalErrData,isUTC }) => {
  const [helperVisible, setHelperVisible] = useState(false);

  if (!criticalErrData) {
    return <div className={style.body}>Loading...</div>;
  }

  const formatLogTime = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // 월은 0부터 시작
    const day = pad(date.getDate());
    return `${year}${month}${day}`;
  };

  const content = criticalErrData.map((data, index) => {
    // UTC 표시 여부에 따라 날짜 변환
    const baseDate = new Date(data.log_time);
    const displayDate = isUTC
      ? new Date(baseDate.getTime() + 15 * 60 * 60 * 1000)
      : baseDate;
    const formattedDate = formatLogTime(displayDate);
    
    return (
      <div key={index} className={style.tableBody}>
        <div>{formattedDate}</div>
        <div>{data.service}</div>
        <div>{data.log_level}</div>
        <div>{data.message}</div>
      </div>
    );
  });

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
        {content}
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
