import style from "../styles/total-memory.module.scss";

interface MemoryData {
  date: string;
  value: number;
}

interface TotalMemoryProps {
  memData: MemoryData[];
}

const TotalMemory: React.FC<TotalMemoryProps> = ({ memData }) => {
  if (!memData) {
    return <div className={style.body}>Loading...</div>;
  }
  return (
    <div className={style.body}>
      <p>total mem.</p>
      <div>
        {memData.map((data, index) => (
          <div key={index}>
            <span>{data.date}</span>: <span>{data.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalMemory;
