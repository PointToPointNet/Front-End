import TotalMemory from "./Total-memory.tsx";
import TotalCpu from "./Total-cpu.tsx";
import TotalPacket from "./Total-packet.tsx";
import TotalConnect from "./Total-connect.tsx";
import TotalError from "./Total-error.tsx";
import TotalLogin from "./Total-login.tsx";
import TotalLogs from "./Total-logs.tsx";
import { FiPlayCircle } from "react-icons/fi";
import style from "../styles/dashboard-total.module.scss";
// 2025.02.23 **SDH**
import { useState, useEffect } from "react";
import TotalDatepicker from "./Total-datepicker.tsx";

interface DashboardTotalProps {
  serverName: string;
  setPage: () => void;
}

const DashboardTotal: React.FC<DashboardTotalProps> = ({
  serverName,
  setPage
}) => {

  //임시 서버 매핑!!
  const serverMapping: { [key: string]: number } = {
    test: 1,
    c1: 2,
    c2: 3,
    c3: 4,
    c4: 5
  };

  //State Area

  const [totalPageDate, setTotalPageDate] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2025-02-01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-02-07"));

  const [memData, setMemData] = useState<any[] | null>(null);
  const [cpuData, setCpuData] = useState<any[] | null>(null);
  const [packetData, setPacketData] = useState<any[] | null>(null);

  const [webConnectData, setWebConnectData] = useState<any[] | null>(null);
  const [errGraphData, setErrGraphData] = useState<any[] | null>(null);
  const [loginData, setLoginData] = useState<any[] | null>(null);

  const [criticalErrData, setCriticalErrData] = useState<any[] | null>(null);

  const [apacheErr, setApacheErr] = useState<any[] | null>(null);
  const [authErr, setAuthErr] = useState<any[] | null>(null);
  const [mysqlErr, setMysqlErr] = useState<any[] | null>(null);
  const [ufwErr, setUfwErr] = useState<any[] | null>(null);

  //END State Area

  const handleDateChange = (newStart: Date | null, newEnd: Date | null) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const getTotalPageData = () => {
    const url = "http://localhost:3000/get_total_page_info";
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        start_date: `${getLocalDateString(startDate)}`,
        end_date: `${getLocalDateString(endDate)}`,
        server_id: serverMapping[serverName]
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalPageDate(data);
        console.log(data);
      });
  };

  const getLocalDateString = (date: Date | null): string => {
    const year = date?.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date?.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //Data Parsing!
  const dataParsing = (totalPageData: any): void => {
    const {
      login_info,
      critical_log,
      total_info,
      select_apache_err,
      select_auth_err,
      select_mysql_err,
      select_ufw_err
    } = totalPageData;
    setLoginData(login_info);
    setCriticalErrData(critical_log);
    setApacheErr(select_apache_err);
    setAuthErr(select_auth_err);
    setMysqlErr(select_mysql_err);
    setUfwErr(select_ufw_err);

    const tempMemData: any[] = [];
    const tempCpuData: any[] = [];
    const tempPacketData: any[] = [];

    const tempWebConnectData: any[] = [];
    const tempErrGraphData: any[] = [];
    // const tempLoginData: any[] = [];

    total_info.forEach((info: any) => {
      const parsedDate = info.recorded_date.split("T")[0];
      tempMemData.push({
        date: parsedDate,
        value: Number(info.mem_avg)
      });
      tempCpuData.push({
        date: parsedDate,
        value: Number(info.cpu_avg)
      });
      tempPacketData.push({
        date: parsedDate,
        rxData: Number(info.rx_data),
        txData: Number(info.tx_data)
      });
      tempWebConnectData.push({
        date: parsedDate,
        value: Number(info.web_access_count) * 13
      });

      tempErrGraphData.push({
        date: parsedDate,
        web: Number(info.web_error_count),
        ufw: Number(info.ufw_count),
        auth: Number(info.auth_error_count),
        mysql: Number(info.mysql_err_count)
      });
    });
    setMemData(tempMemData);
    setCpuData(tempCpuData);
    setPacketData(tempPacketData);
    setWebConnectData(tempWebConnectData);
    setErrGraphData(tempErrGraphData);
  };
  //End Data Parsing!
  useEffect(() => {
    getTotalPageData();
  }, []);

  useEffect(() => {
    if (!totalPageDate) return;
    dataParsing(totalPageDate);
  }, [totalPageDate]);
  return (
    <div className={style.dashboard}>
      <div className={style.header}>
        <h1 className={style.title}>Total - {serverName}</h1>
        {/* <TotalDatepicker onDateChange={handleDateChange}></TotalDatepicker>
        <button
          onClick={() => {
            getTotalPageData();
          }}
        >
          조회
        </button> */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage();
          }}
        >
          <FiPlayCircle /> 실시간 모니터링
        </a>
        {/*2025.02.23 **SDH**   */}
        <div className={style.searchbox}>
        <TotalDatepicker onDateChange={handleDateChange}></TotalDatepicker>
        <button
          onClick={() => {
            getTotalPageData();
          }}
        >
          조회
        </button>
        </div>
        {/*2025.02.23 END **SDH** */}
      </div>

      <div className={style.total}>
        <div className={style.section1}>
          <TotalMemory memData={memData}></TotalMemory>
          <TotalCpu cpuData={cpuData}></TotalCpu>
          <TotalPacket packetData={packetData}></TotalPacket>
          <TotalConnect webConnectData={webConnectData}></TotalConnect>
          <TotalError errGraphData={errGraphData} apacheErr={apacheErr} ></TotalError>
          <TotalLogin loginData={loginData}></TotalLogin>
        </div>
        <div className={style.section3}>
          <TotalLogs criticalErrData={criticalErrData}></TotalLogs>
        </div>
      </div>
    </div>
  );
};

export default DashboardTotal;
