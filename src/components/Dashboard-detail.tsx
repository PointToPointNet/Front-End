// 각 데이터들을 나타내는 컴포넌트들이이 모여있는 상세페이지
// 구성 :
// Nav-bar.tsx, Board-packet.tsx, Board-ports.tsx, Board-runtime.tsx, Board-status.tsx, Board-users.tsx
import NavBar from './Nav-bar.tsx'
import BoardRuntime from './Board-runtime.tsx';
import BoardStatus from './Board-status.tsx';
// import BoardResspeed from './Board-resspeed.tsx';

import detail from '../styles/dashboard-detail.module.scss';

const DashboardDetail: React.FC = () => {

    return <>
        <div className={detail.navbar}>
        <NavBar></NavBar>
        </div>
        <div className={detail.board}>
            <div className={detail.boardTop}>
                <BoardRuntime></BoardRuntime>
                <BoardStatus></BoardStatus>
                {/* <BoardResspeed></BoardResspeed> */}
            </div>
            <div className={detail.boardBody}>
                {/* <BoardPorts></BoardPorts>
                <BoardPacket></BoardPacket>
                <BoardUsers></BoardUsers> */}
            </div>
        </div>
    </>
    


}

export default DashboardDetail;