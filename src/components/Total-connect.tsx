import style from '../styles/total-connect.module.scss';

interface WebConnectData{
  date: string;
  value: number;
}
interface TotalConnectProps{
  webConnectData:  WebConnectData[];
}

const TotalConnect: React.FC<TotalConnectProps> = ({webConnectData}) => {

  if(!webConnectData){ return <div className={style.body}>Loading...</div> }
  return  <div className={style.body}>
  <p>total web server. connect.</p>
  {webConnectData.map( (data,index)=>{
    return(
    <div key={index}>
      <span>{data.date}: {data.value}</span>
    </div>)
  } )}
</div>
    
  

}

export default TotalConnect;