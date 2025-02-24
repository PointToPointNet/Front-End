import style from '../styles/dashboard-main.module.scss';
interface DashBoardMainProps {
    serverList: string[];
    setPage: (pageName: string) => void;
    changeServer: (serverName: string) => void;
}
const DashboardMain: React.FC<DashBoardMainProps> = ({ serverList, setPage, changeServer }) => {

    const serverBody = serverList.map( (server, index) => (
        <div 
        key={index} 
        className={style.body}
        onClick={()=>{
            setPage("detail");
            changeServer(server);
        }}
        >{server}</div>
    ))
  return <div className={style.dashboard}>
        <div className={style.header}>
            <h1 className={style.title}>Main Page</h1>
        </div>
        <div className={style.main}>
            {serverBody}
        </div>
    </div>
    


}

export default DashboardMain;
