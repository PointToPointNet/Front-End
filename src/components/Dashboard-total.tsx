import { useState, useEffect } from "react";
import style from "../styles/dashboard-total.module.scss";

import TotalMemory from "./Total-memory.tsx";
import TotalCpu from "./Total-cpu.tsx";
import TotalPacket from "./Total-packet.tsx";
import TotalConnect from "./Total-connect.tsx";
import TotalError from "./Total-error.tsx";
import TotalLogin from "./Total-login.tsx";
import TotalLogs from "./Total-logs.tsx";
import TotalDatepicker from "./Total-datepicker.tsx";

import { FiPlayCircle } from "react-icons/fi";
import { TbReportSearch } from "react-icons/tb";

import url from "../assets/config/url.ts";
// 외부에 정의된 인터페이스 (예: 서버 맵핑, 전체 페이지 데이터 객체)
import { ServerMapping, DataObject } from "../types/forTotal/index.ts";

// 자식 컴포넌트에서 사용할 데이터 타입들을 아래와 같이 정의합니다.
export interface MemoryData {
  date: string;
  value: number;
}

export interface CpuData {
  date: string;
  value: number;
}

export interface PacketData {
  date: string;
  rxData: number;
  txData: number;
}

export interface WebConnectData {
  date: string;
  value: number;
}

export interface ErrGraphData {
  date: string;
  web: number;
  ufw: number;
  auth: number;
  mysql: number;
}

export interface LoginData {
  server_id: number;
  user: string;
  login_count: number;
  last_login_time: string;
}

export interface CriticalErrData {
  server_id: number;
  log_time: string;
  service: string;
  log_level: string;
  message: string;
}

export interface ApacheError {
  log_time: string;
  log_level: string;
  error_code: string;
  message: string;
}

export interface MysqlError {
  log_time: string;
  log_level: string;
  error_code: string;
  message: string;
}

export interface UfwError {
  log_time: string;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  src_port: number | null;
  dst_port: number | null;
  action: string;
}

export interface AuthError {
  log_time: string;
  service: string;
  user: string;
  src_ip: string;
  action: string;
}

// DashboardTotal 컴포넌트의 Props 인터페이스
interface DashboardTotalProps {
  serverName: string;
  setPage: () => void;
  goAllTotal: () => void;
}

const DashboardTotal: React.FC<DashboardTotalProps> = ({
  serverName,
  setPage,
  goAllTotal,
}) => {
  // State Area
  const [serverMapping, setServerMapping] = useState<ServerMapping | null>(
    null
  );
  const [totalPageDate, setTotalPageDate] = useState<DataObject | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date("2025-02-01"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-02-07"));

  const [memData, setMemData] = useState<MemoryData[]>([]);
  const [cpuData, setCpuData] = useState<CpuData[]>([]);
  const [packetData, setPacketData] = useState<PacketData[]>([]);

  const [webConnectData, setWebConnectData] = useState<WebConnectData[]>([]);
  const [errGraphData, setErrGraphData] = useState<ErrGraphData[]>([]);
  const [loginData, setLoginData] = useState<LoginData[]>([]);

  const [criticalErrData, setCriticalErrData] = useState<CriticalErrData[]>([]);

  const [apacheErr, setApacheErr] = useState<ApacheError[]>([]);
  const [authErr, setAuthErr] = useState<AuthError[]>([]);
  const [mysqlErr, setMysqlErr] = useState<MysqlError[]>([]);
  const [ufwErr, setUfwErr] = useState<UfwError[]>([]);

  // UTC 여부는 boolean으로 관리합니다.
  const [isUTC, setIsUTC] = useState<boolean>(false);
  // END State Area

  // 날짜 문자열 생성 함수 (YYYY-MM-DD 형식)
  const getLocalDateString = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 보정 함수: 입력된 날짜와 기록 날짜에 따라 처리
  const correctDate = (
    inputDate: string,
    startDate: Date | null,
    recordedDate: string
  ): string => {
    let parseDate = "";
    if (inputDate === getLocalDateString(startDate)) {
      // KST 표준 시간인 경우
      parseDate = recordedDate.split("T")[0];
      return parseDate;
    } else {
      // UTC 표준 시간인 경우
      const utcDate = new Date(recordedDate.split("T")[0]);
      const kstDate = new Date(utcDate.getTime() + 15 * 60 * 60 * 1000);
      const year = kstDate.getFullYear();
      const month = String(kstDate.getMonth() + 1).padStart(2, "0");
      const day = String(kstDate.getDate()).padStart(2, "0");
      parseDate = `${year}-${month}-${day}`;
      return parseDate;
    }
  };

  const handleDateChange = (newStart: Date | null, newEnd: Date | null) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const getServerData = () => {
    fetch(`${url.url}/server`)
      .then((res) => res.json())
      .then((data) => {
        setServerData(data);
      });
  };

  const setServerData = (data: any[]) => {
    const tempObj: ServerMapping = {};
    data.forEach((server) => {
      tempObj[server["name"]] = server["id"];
    });
    setServerMapping(tempObj);
  };

  const getTotalPageData = () => {
    if (!serverMapping) return;
    fetch(`${url.url}/get_total_page_info`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        start_date: getLocalDateString(startDate),
        end_date: getLocalDateString(endDate),
        server_id: serverMapping[serverName],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalPageDate(data);
        console.log(data);
      });
  };

  // Data Parsing!
  const dataParsing = (totalPageData: any): void => {
    const {
      login_info,
      critical_log,
      total_info,
      select_apache_err,
      select_auth_err,
      select_mysql_err,
      select_ufw_err,
    } = totalPageData;

    setLoginData(login_info);
    setCriticalErrData(critical_log);
    setApacheErr(select_apache_err);
    setAuthErr(select_auth_err);
    setMysqlErr(select_mysql_err);
    setUfwErr(select_ufw_err);

    const tempMemData: MemoryData[] = [];
    const tempCpuData: CpuData[] = [];
    const tempPacketData: PacketData[] = [];
    const tempWebConnectData: WebConnectData[] = [];
    const tempErrGraphData: ErrGraphData[] = [];

    const checkData = total_info[0].recorded_date.split("T")[0];
    // 다른 컴포넌트에 UTC 여부를 알려주기 위한 처리
    if (checkData !== getLocalDateString(startDate)) {
      setIsUTC(true);
    } else {
      setIsUTC(false);
    }
    total_info.forEach((info: any) => {
      const parsedDate = correctDate(checkData, startDate, info.recorded_date);
      tempMemData.push({
        date: parsedDate,
        value: Number(info.mem_avg),
      });
      tempCpuData.push({
        date: parsedDate,
        value: Number(info.cpu_avg),
      });
      tempPacketData.push({
        date: parsedDate,
        rxData: Number(info.rx_data),
        txData: Number(info.tx_data),
      });
      tempWebConnectData.push({
        date: parsedDate,
        value: Number(info.web_access_count) * 13,
      });
      tempErrGraphData.push({
        date: parsedDate,
        web: Number(info.web_error_count),
        ufw: Number(info.ufw_count),
        auth: Number(info.auth_error_count),
        mysql: Number(info.mysql_err_count),
      });
    });
    setMemData(tempMemData);
    setCpuData(tempCpuData);
    setPacketData(tempPacketData);
    setWebConnectData(tempWebConnectData);
    setErrGraphData(tempErrGraphData);
  };
  // End Data Parsing!

  useEffect(() => {
    const fetchData = async () => {
      await getServerData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (serverMapping) {
      getTotalPageData();
    }
  }, [serverMapping]);

  useEffect(() => {
    if (!totalPageDate) return;
    dataParsing(totalPageDate);
  }, [totalPageDate]);

  return (
    <div className={style.dashboard}>
      <div className={style.header}>
        <h1 className={style.title}>Total - {serverName}</h1>
        <div className={`${style.btngroup} ${style.last}`}>
          <a
            href="#"
            className={style.alltotal}
            onClick={(e) => {
              e.preventDefault();
              goAllTotal();
            }}
          >
            <TbReportSearch /> 전체
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage();
            }}
          >
            <FiPlayCircle /> 실시간 모니터링
          </a>
        </div>
        <div className={style.searchbox}>
          <TotalDatepicker onDateChange={handleDateChange} />
          <button onClick={getTotalPageData}>조회</button>
        </div>
      </div>

      <div className={style.total}>
        <div className={style.section1}>
          <TotalMemory memData={memData} />
          <TotalCpu cpuData={cpuData} />
          <TotalPacket packetData={packetData} />
          <TotalConnect webConnectData={webConnectData} />
          <TotalError
            errGraphData={errGraphData}
            apacheErr={apacheErr}
            authErr={authErr}
            mysqlErr={mysqlErr}
            ufwErr={ufwErr}
          />
          <TotalLogin loginData={loginData} />
        </div>
        <div className={style.section3}>
          <TotalLogs criticalErrData={criticalErrData} isUTC={isUTC} />
        </div>
      </div>
    </div>
  );
};

export default DashboardTotal;
