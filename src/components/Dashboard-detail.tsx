import { TbReportSearch } from "react-icons/tb";
import BoardRuntime from './Board-runtime.tsx';
import BoardStatus from './Board-status.tsx';
import BoardResspeed from './Board-resspeed.tsx';
import BoardPorts from './Board-ports.tsx';
import BoardPacket from './Board-packet.tsx';
import BoardUsers from './Board-users.tsx';


import style from '../styles/dashboard-detail.module.scss';

interface ParentProps {
    serverName: string;
    setPage: () => void;
    goAllTotal: () => void;
}

const DashboardDetail: React.FC<ParentProps> = ({ serverName, setPage, goAllTotal }) => {
    return <div className={style.dashboard}>
            <div className={style.header}>
            <h1 className={style.title}>Network Dashboard - {serverName}</h1>
            <div className={style.btngroup}>
            <a href="#" className={style.alltotal} 
            onClick={e=>{
              e.preventDefault();
              goAllTotal();
            }}
          ><TbReportSearch /> 전체서버통계</a>
            <a href="#" onClick={ e=>{
                    e.preventDefault();
                    setPage();
            }}><TbReportSearch /> 통계</a>
            </div>
            </div>
        <div className={style.board}>
            <div className={style.boardTop}>
                <BoardRuntime serverName={serverName}></BoardRuntime>
                <BoardStatus serverName={serverName}></BoardStatus>
                <BoardResspeed serverName={serverName}></BoardResspeed>
            </div>
            <div className={style.boardBody}>
                <BoardPorts serverName={serverName}></BoardPorts>
                <BoardPacket serverName={serverName}></BoardPacket>
                <BoardUsers serverName={serverName}></BoardUsers>
            </div>
        </div>
    </div>
    


}

export default DashboardDetail;