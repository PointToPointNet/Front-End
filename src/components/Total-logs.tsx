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
      <p>total logs</p>
      {criticalErrData.map((data, index) => {
        return (<div key={index}>
          <span>{data.log_time} {data.service} {data.log_level} {data.message}</span>
        </div>)
      })}
    </div>
  );
};

export default TotalLogs;
