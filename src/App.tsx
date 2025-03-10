import { useEffect, useState } from "react";
import './App.css';
import NavBar from './components/Nav-bar.tsx';
import DashboardMain from './components/Dashboard-main.tsx';
import DashboardDetail from './components/Dashboard-detail.tsx';
import DashboardTotal from './components/Dashboard-total.tsx';
import DashboardAllTotal from './components/Dashboard-all-total.tsx';
import style from './styles/dashboard-detail.module.scss';

import url from "./assets/config/url.ts";
import ChatBot from "./components/Chatbot.tsx";

const App: React.FC = () => {
  // const [serverList, setServerList] = useState<string[]>(["kkms", "peter", "lauren", "JUH", "SHJ"]);
  const [serverList, setServerList] = useState<string[]>([]);
  const [activeServer, setActiveServer] = useState<string>("home");
  const [mode, setMode] = useState<string>("home");

  const [modeTSX, setModeTSX] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    const getServerList = async () => {
      const response = await fetch(`${url.url}/server`);
      const serverList = await response.json();

      if (serverList) {
        setServerList(serverList.map((server: { name: string }) => {
          return server.name;
        }));
      }
    }
    getServerList();
  }, []);

  useEffect(() => {
    if (serverList.length > 0) {
      switch (mode) {
        case "home":
          setModeTSX(<DashboardMain
            serverList={serverList}
            setPage={(page) => {
              setMode(page);
            }}
            changeServer={(server) => {
              setActiveServer(server);
            }}
          ></DashboardMain>)
          break;
        case "detail":
          setModeTSX(<DashboardDetail serverName={activeServer}
            setPage={() => {
              setMode("total");
            }}
            goAllTotal={() => {
              setMode("allTotal");
            }}
          ></DashboardDetail>)
          break;
        case "total":
          setModeTSX(<DashboardTotal serverName={activeServer}
            setPage={() => {
              setMode("detail");
            }}
            goAllTotal={() => {
              setMode("allTotal");
            }}
          ></DashboardTotal>)
          break;
        case "allTotal":
          setModeTSX(<DashboardAllTotal
            setPage={() => {
              setMode("home");
              setActiveServer("home")
            }}
          ></DashboardAllTotal>)
          break;
      }
    }
  }, [serverList, mode, activeServer]);

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
    {modeTSX ? modeTSX : <h1>Loading...</h1>}
    <ChatBot></ChatBot>
  </div>
}

export default App;
