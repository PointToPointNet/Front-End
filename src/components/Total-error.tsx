import style from "../styles/total-error.module.scss";

interface ErrGraphData {
  date: string;
  web: number;
  ufw: number;
  auth: number;
  mysql: number;
}
interface TotalErrorProps {
  errGraphData: ErrGraphData[];
}

const TotalError: React.FC<TotalErrorProps> = ({ errGraphData }) => {
  if (!errGraphData) {
    return <div className={style.body}></div>;
  }
  return (
    <div className={style.body}>
      <p>total. error graph</p>
      {errGraphData.map((data, index) => {
        return (
          <div key={index}>
            <span>{data.date}: web: {data.web} ufw: {data.ufw} auth: {data.auth} mysql: {data.mysql}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TotalError;
