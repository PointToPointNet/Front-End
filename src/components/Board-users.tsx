import style from '../styles/board-users.module.scss';

const BoardUsers: React.FC = () => {

  return <div className={style.body}>
      <div className={style.tableHeader}>
        <div>Name</div>
        <div>TTY</div>
        <div>IP / HOST</div>
        <div>Time</div>
        <div>Disk</div>
        <div>Desconnect</div>
      </div>
      <div className={style.tableBody}>
        <div>ABC</div>
        <div>pts/0</div>
        <div>211.252.26.9</div>
        <div>Sat Feb 15 11:20 - 10:29</div>
        <div>40/100(bar)</div>
        <div>button</div>
      </div>
      <div className={style.tableBody}>
        <div>ABC</div>
        <div>pts/0</div>
        <div>211.252.26.9</div>
        <div>Sat Feb 15 11:20 - 10:29</div>
        <div>40/100(bar)</div>
        <div>button</div>
      </div>
    </div>
    
  

}

export default BoardUsers;