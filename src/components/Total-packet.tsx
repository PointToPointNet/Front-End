import style from '../styles/total-packet.module.scss';

interface PacketData{
  date: string;
  rxData: number;
  txData: number;
}

interface TotalPacketProps{
  packetData: PacketData[];
}

const TotalPacket: React.FC<TotalPacketProps> = ({packetData}) => {
  if(!packetData) return <div className={style.body}>Loading...</div>

  return  <div className={style.body}>
  <p>total packet.</p>
  {packetData.map( (data,index)=>{
    return(
      <div key={index}>
        <span>{data.date}: rx:{data.rxData} tx:{data.txData}</span>
      </div>
    );
  } )}
</div>
    
  

}

export default TotalPacket;