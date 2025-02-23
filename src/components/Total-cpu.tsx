import style from "../styles/total-cpu.module.scss";
interface CpuData {
  date: string;
  value: number;
}
interface TotalCpuProps {
  cpuData: CpuData[];
}

const TotalCpu: React.FC<TotalCpuProps> = ({cpuData}) => {
  if (!cpuData) return <div className={style.body}>Loading...</div>;
  return (
    <div className={style.body}>
      <p>total cpu.</p>
        {cpuData.map((data, index) => {
          return(
          <div key={index}>
            <span>
              {data.date}: {data.value}
            </span>
          </div>);
        })}
    </div>
  );
};

export default TotalCpu;
