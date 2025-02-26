import { FiPlayCircle } from "react-icons/fi";
import style from "../styles/dashboard-all-total.module.scss";
import AllTotalMemory from "./All-total-memory.tsx";
import AllTotalCpu from "./All-total-cpu.tsx";
import AllTotalPacket from "./All-total-packet.tsx";
import AllTotalConnect from "./All-total-connect.tsx";
import AllTotalDatepicker from "./All-total-datepicker.tsx";
import { FaUser } from "react-icons/fa";
// 2025.02.23 **SDH**
import { useState, useEffect } from "react";

import url from "../assets/config/url.ts";

interface DashboardAllTotalProps {
  serverName: string;
  setPage: () => void;
}
interface ServerMapping {
  [key: string]: number;
}

const DashboardAllTotal: React.FC<DashboardAllTotalProps> = ({
  serverName,
  setPage
}) => {
  //State Area

  //For server
  const [serverMapping, setServerMapping] = useState<ServerMapping | null>(
    null
  );
  //For date
  const [totalPageDate, setTotalPageDate] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2025-02-01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-02-07"));

  //For components data
  const [memData, setMemData] = useState({});
  const [cpuData, setCpuData] = useState({});
  const [webData, setWebData] = useState({});
  const [packetData, setPacketData] = useState({});
  // //END State Area

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

  //날짜 보정하는 함수
  const correctDate = (inputDate, startDate, recordedDate) => {
    let parseDate = "";
    if (inputDate === getLocalDateString(startDate)) {
      // console.log("KST표준시간");
      parseDate = recordedDate.split("T")[0];
      return parseDate;
    } else {
      // console.log("UTC표준시간");
      const utcDate = new Date(recordedDate.split("T")[0]);
      const kstDate = new Date(utcDate.getTime() + 15 * 60 * 60 * 1000);
      const year = kstDate.getFullYear();
      const month = String(kstDate.getMonth() + 1).padStart(2, "0");
      const day = String(kstDate.getDate()).padStart(2, "0");
      parseDate = `${year}-${month}-${day}`;
      return parseDate;
    }
  };

  //서버데이터 역으로
  const setServerData = (data) => {
    const tempObj = {};
    data.forEach((server) => {
      tempObj[server["id"]] = server["name"];
    });
    setServerMapping(tempObj);
  };

  const getTotalPageData = () => {
    fetch(`${url.url}/get_total_all_info`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        start_date: `${getLocalDateString(startDate)}`,
        end_date: `${getLocalDateString(endDate)}`
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalPageDate(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLocalDateString = (date: Date | null): string => {
    const year = date?.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date?.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  ///////////////////////DataParsing//////////////////////////////

  const dataParsing = (totalPageData) => {
    const { total_all_page } = totalPageData;
    //UTC인지 아닌지 데이터 체크를 위한 변수
    const checkData = total_all_page[0].recorded_date.split("T")[0];

    //parsing을 위한 함수
    const parsing = (total_all_page, attr, number=1) => {
      return total_all_page.reduce((acc, cur) => {
        const date = correctDate(checkData, startDate, cur.recorded_date);
        //누적 객체의 데이트값이 없으면, 해당날짜의 빈객체 생성
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][serverMapping[cur.server_id]] = Number(cur[attr] * number);
        return acc;
      }, {});
    };

    const groupedMemory = parsing(total_all_page, "mem_avg");
    const groupedCpu = parsing(total_all_page, "cpu_avg");
    const groupedWeb = parsing(total_all_page, "web_access_count",13 );
    const groupedPacket = parsing(total_all_page, "total" );

    setMemData(groupedMemory);
    setCpuData(groupedCpu);
    setWebData(groupedWeb);
    setPacketData(groupedPacket);
  };

  ///////////////////////DataParsing//////////////////////////////

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
        <h1 className={style.title}>Server Insight</h1>
        
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("home");
          }}
        >
          <FiPlayCircle /> Home
        </a>
        {/*2025.02.23 **SDH**   */}
        <div className={style.searchbox}>
          <AllTotalDatepicker
            onDateChange={handleDateChange}
          ></AllTotalDatepicker>
          <button
            onClick={() => {
              getTotalPageData();
            }}
          >
            조회
          </button>
        </div>
        {/*2025.02.23 END **SDH** */}
        
        <div className={style.tag}>
        <span className={style.kkms}> <FaUser /> kkms </span>
        <span className={style.peter}> <FaUser /> peter </span>
        <span className={style.lauren}> <FaUser /> lauren </span>
        <span className={style.juh}> <FaUser /> JUH </span>
        <span className={style.shj}> <FaUser /> SHJ </span>
      </div>
      </div>
      
      <div className={style.total}>
        <div className={style.section4}>
          <AllTotalMemory memData={memData}></AllTotalMemory>
          <AllTotalCpu cpuData={cpuData}></AllTotalCpu>
          <AllTotalPacket packetData={packetData}></AllTotalPacket>
          <AllTotalConnect webData={webData}></AllTotalConnect>
          {/* <AllTotalError></AllTotalError> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardAllTotal;
