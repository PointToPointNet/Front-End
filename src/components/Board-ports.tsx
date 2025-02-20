// 포트사용현황, 활성포트 확인 컴포넌트트
import style from '../styles/board-ports.module.scss';

const BoardPorts: React.FC = () => {

  return <div className={style.portsbody}>
      <div className={style.body}>graph</div>
      <div className={style.body}>list</div>
    </div>
    
  

}

export default BoardPorts;