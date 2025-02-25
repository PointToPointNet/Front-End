import { useEffect, useState } from "react";
import './App.css';
import NavBar from './components/Nav-bar.tsx';
import DashboardMain from './components/Dashboard-main.tsx';
import DashboardDetail from './components/Dashboard-detail.tsx';
import DashboardTotal from './components/Dashboard-total.tsx';
import style from './styles/dashboard-detail.module.scss';

const App: React.FC = () => {

  const [serverList, setServerList] = useState<string[]>(["kkms","peter","lauren","JUH","SHJ"]);
  const [activeServer, setActiveServer] = useState<string>("home");
  const [mode, setMode] = useState<string>("home");

  useEffect(() => {
    const getServerList = async () => {
      const response = await fetch("http://localhost:3000/server");
      const serverList = await response.json();

      if (serverList) {
        setServerList(serverList.map((server: { name: string }) => {
          return server.name;
        }));
      }
    }
    getServerList();
  }, []);
  let myScreen;
  if (serverList) {
    switch (mode) {
      case "home":
        myScreen = <DashboardMain
          serverList={serverList}
          setPage={(page) => {
            setMode(page);
          }}
          changeServer={(server) => {
            setActiveServer(server);
          }}
        ></DashboardMain>
        break;
      case "detail":
        myScreen = <DashboardDetail serverName={activeServer}
          setPage={() => {
            setMode("total");
          }}
        ></DashboardDetail>
        break;
      case "total":
        myScreen = <DashboardTotal serverName={activeServer}
          setPage={() => {
            setMode("detail");
          }}
        ></DashboardTotal>
        break;
    }
    console.log(serverList)
  }

  return <div className={`${style.container} light`}>
    <div className={style.navbar}>
      <NavBar
        activeServer={activeServer}
        changeServer={(serverName) => {
          setActiveServer(serverName);
        }}
        changePage={(page) => {
          setMode(page);
        }}
        serverList={serverList}
      ></NavBar>
    </div>
    {myScreen}
  </div>

}

export default App;
