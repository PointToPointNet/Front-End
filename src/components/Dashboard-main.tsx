import { useEffect, useState } from 'react';

import style from '../styles/dashboard-main.module.scss';
import { TbReportSearch } from "react-icons/tb";
import DashboardMainBox from './Dashboard-mainbox';
import url from "../assets/config/url.ts";

interface DashBoardMainProps {
    serverList: string[];
    setPage: (pageName: string) => void;
    changeServer: (serverName: string) => void;
}

const DashboardMain: React.FC<DashBoardMainProps> = ({ serverList, setPage, changeServer }) => {
    const [serverBody, setServerBody] = useState<React.ReactElement[]>([]);
    // const mainGraph = useRef<SVGSVGElement | null>(null);
    // console.log(url)
    useEffect(() => {
        const getData = (data: { [key: string]: string }[], serverName: string, type: string) => {
            const server = data.find((serverData) => serverName in serverData);
            if (!server || !(serverName in server)) {
                return undefined;
            }
            return server[serverName][type];
        };
        const fetchData = async (path: string) => {
            const res = await fetch(`${url.url}/${path}`);
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
                                swap={(Number(getData(status, server, "swap")["usingSwap"]) * 100 / Number(getData(status, server, "swap")["totalSwap"])).toFixed(1)}
                                cpu={getData(status, server, "cpu")["cpuUtilization"]}
                                disk={(Number(getData(status, server, "disk")["usingDisk"]) * 100 / Number(getData(status, server, "disk")["totalDisk"])).toFixed(1)}
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
        }, 2000);
        return () => { clearInterval(interval); }
    }, []);

    return <div className={style.dashboard}>
        <div className={style.header}>
            <h1 className={style.title}>Server Overview</h1>
            <a href="#" onClick={e => {
                e.preventDefault();
                setPage("allTotal");
            }}><TbReportSearch /> 전체</a>
        </div>
        <div className={style.main}>
            {serverBody}
        </div>
    </div>
}

export default DashboardMain;
