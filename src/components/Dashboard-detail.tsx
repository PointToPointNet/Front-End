import BoardRuntime from './Board-runtime.tsx';
import BoardStatus from './Board-status.tsx';
import BoardResspeed from './Board-resspeed.tsx';
import BoardPorts from './Board-ports.tsx';
import BoardPacket from './Board-packet.tsx';
import BoardUsers from './Board-users.tsx';

import style from '../styles/dashboard-detail.module.scss';

const DashboardDetail: React.FC = () => {

  return <> 
        <div className={style.board}>
            <div className={style.boardTop}>
                <BoardRuntime></BoardRuntime>
                <BoardStatus></BoardStatus>
                <BoardResspeed></BoardResspeed>
            </div>
            <div className={style.boardBody}>
                <BoardPorts></BoardPorts>
                <BoardPacket></BoardPacket>
                <BoardUsers></BoardUsers>
            </div>
        </div>
    </>
    


}

export default DashboardDetail;