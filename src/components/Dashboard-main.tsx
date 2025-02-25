import { useEffect, useState } from 'react';
import style from '../styles/dashboard-main.module.scss';

import DashboardMainBox from './Dashboard-mainbox';

interface DashBoardMainProps {
    serverList: string[];
    setPage: (pageName: string) => void;
    changeServer: (serverName: string) => void;
}

const DashboardMain: React.FC<DashBoardMainProps> = ({ serverList, setPage, changeServer }) => {
    const [serverBody, setServerBody] = useState<React.ReactElement[]>([]);
    // const mainGraph = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const getData = (data: { [key: string]: string }[], serverName: string, key: string) => {
            const server = data.find((serverData) => serverName in serverData);
            if (!server || !(serverName in server)) {
                return undefined;
            }
            return server[serverName][key];
        };
        const fetchData = async (url: string) => {
            const res = await fetch(`http://localhost:3000/${url}`);
            return res.json();
        }
        const displayServers = async () => {
            const status = await fetchData("status");
            const runtime = await fetchData("runtime");
            const ping = await fetchData("ping");

            if (status && runtime && ping) {
                setServerBody(serverList.map((server, index) => {
                    return (
                        <div
                            key={index}
                            className={style.body}
                            onClick={() => {
                                setPage("detail");
                                changeServer(server);
                            }}>
                            <DashboardMainBox
                                key={server}
                                server={server}
                                runtime={getData(runtime, server, "runtime")}
                                memory={(Number(getData(status, server, "memory")["usingMemory"]) * 100 / Number(getData(status, server, "memory")["totalMemory"])).toFixed(1)}
                                cpu={getData(status, server, "cpu")["cpuUtilization"]}
                                disk={getData(status, server, "disk")["diskUtilization"]}
                                ping={getData(ping, server, "pingResponse")}
                            ></DashboardMainBox>
                        </div >
                    );
                }));
            }
        }

        displayServers();
        const interval = setInterval(() => {
            displayServers();
        }, 1500);
        return () => { clearInterval(interval); }
    }, []);

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
