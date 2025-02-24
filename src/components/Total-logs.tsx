import style from "../styles/total-logs.module.scss";
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
  console.log(criticalErrData);
  if (!criticalErrData) {
    return <div className={style.body}>Loading...</div>;
  }
  return (
    <div className={style.body}>
      <div className={style.body}>
        <div className={style.tableHeader}>
          <div>LOG_TIME</div>
          <div>SERVICE</div>
          <div>LOG_LEVEL</div>
          <div>MESSAGE</div>
        </div>
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
    </div>
  );
};

export default TotalLogs;
