import TotalMemory from './Total-memory.tsx';
import TotalCpu from './Total-cpu.tsx';
import TotalPacket from './Total-packet.tsx';
import TotalConnect from './Total-connect.tsx';
import TotalError from './Total-error.tsx';
import TotalLogin from './Total-login.tsx';
import TotalLogs from './Total-logs.tsx';
import { FiPlayCircle } from "react-icons/fi";
import style from '../styles/dashboard-total.module.scss';

const DashboardTotal: React.FC = ({ serverName, setPage }) => {

  return <div className={style.dashboard}>
       <div className={style.header}>
            <h1 className={style.title}>Network Dashboard - {serverName}</h1>
            <a href="#" onClick={ e=>{
                e.preventDefault();
                setPage();
            }}><FiPlayCircle /> 실시간 모니터링</a>
        </div>
        
        <div className={style.total}>
            <div className={style.section1}>
                <TotalMemory></TotalMemory>
                <TotalCpu></TotalCpu>
                <TotalPacket></TotalPacket>
            </div>
            <div className={style.section2}>
                <TotalConnect></TotalConnect>
                <TotalError></TotalError>
                <TotalLogin></TotalLogin>
            </div>
            <div className={style.section3}>
                <TotalLogs></TotalLogs>
            </div>
        </div>
    </div>
    


}

export default DashboardTotal;