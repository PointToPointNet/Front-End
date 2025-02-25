import { useState, useEffect } from "react";
import style from "../styles/total-error-graph-popup.module.scss";
import { IoIosCloseCircle } from "react-icons/io";

const TotalErrorGraphPopup = ({
  closePopup,
  apacheErr,
  authErr,
  mysqlErr,
  ufwErr
}) => {
  const [selectedBtn, setSelectedBtn] = useState("apache");

  const titleObj = {
    apacheTitle: ["LOG_TIME", "LOG_LEVEL", "ERROR_CODE", "MESSAGE"],
    authTitle: ["LOG_TIME", "USER", "SERVICE", "ACTION"],
    mysqlTitle: ["LOG_TIME", "LOG_LEVEL", "ERROR_CODE", "MESSAGE"],
    ufwTitle: ["LOG_TIME", "PROTOCOL", "SRC_IP", "ACTION"]
  };
  const [titles, setTitles] = useState([]);
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    switch (selectedBtn) {
      case "apache":
        setTitles(
          titleObj.apacheTitle.map((title, index) => {
            return <div key={index}>{title}</div>;
          })
        );
        setLogs(
          apacheErr.map((log, index) => {
            return (
              <div key={index} className={style.tableBody}>
                <div>
                  {log.log_time.split("T")[0]}{" "}
                  {log.log_time.split("T")[1].substring(0, 8)}
                </div>
                <div>{log.log_level}</div>
                <div>{log.error_code}</div>
                <div>{log.message}</div>
              </div>
            );
          })
        );

        // setLogs( resData.apacheLogs );
        break;
      case "auth":
        setTitles(
          titleObj.authTitle.map((title, index) => {
            return <div key={index}>{title}</div>;
          })
        );
        setLogs(
          authErr.map((log, index) => {
            return (
              <div key={index} className={style.tableBody}>
                <div>
                  {log.log_time.split("T")[0]}{" "}
                  {log.log_time.split("T")[1].substring(0, 8)}
                </div>
                <div>{log.user}</div>
                <div>{log.service}</div>
                <div>{log.action}</div>
              </div>
            );
          })
        );
        break;
      case "mysql":
        setTitles(
          titleObj.mysqlTitle.map((title, index) => {
            return <div key={index}>{title}</div>;
          })
        );
        setLogs(
          mysqlErr.map((log, index) => {
            return (
              <div key={index} className={style.tableBody}>
                <div>
                  {log.log_time.split("T")[0]}{" "}
                  {log.log_time.split("T")[1].substring(0, 8)}
                </div>
                <div>{log.log_level}</div>
                <div>{log.error_code}</div>
                <div>{log.message}</div>
              </div>
            );
          })
        );
        break;
      case "ufw":
        setTitles(
          titleObj.ufwTitle.map((title, index) => {
            return <div key={index}>{title}</div>;
          })
        );
        setLogs(
          ufwErr.map((log, index) => {
            return (
              <div key={index} className={style.tableBody}>
                <div>
                  {log.log_time.split("T")[0]}{" "}
                  {log.log_time.split("T")[1].substring(0, 8)}
                </div>
                <div>{log.protocol}</div>
                <div>{log.src_ip}</div>
                <div>{log.action}</div>
              </div>
            );
          })
        );
        break;
      default:
        break;
    }
  }, [selectedBtn]);

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <div className={style.buttonArea}>
          <button
            className={selectedBtn === "apache" ? style.active : ""}
            onClick={() => setSelectedBtn("apache")}
          >
            WEB_ERROR
          </button>
          <button
            className={selectedBtn === "mysql" ? style.active : ""}
            onClick={() => setSelectedBtn("mysql")}
          >
            MYSQL_ERROR
          </button>
          <button
            className={selectedBtn === "ufw" ? style.active : ""}
            onClick={() => setSelectedBtn("ufw")}
          >
            UFW
          </button>
          <button
            className={selectedBtn === "auth" ? style.active : ""}
            onClick={() => setSelectedBtn("auth")}
          >
            AUTH_ERROR
          </button>
          <div className={style.closeBtnCantainer}
            onClick={() => {
              closePopup();
            }}
          >
            <IoIosCloseCircle
              className={style.closeBtn}
            ></IoIosCloseCircle>
          </div>
        </div>
        <div className={style.contentArea}>
          <div className={style.tableHeader}>{titles}</div>
          <div className={style.contents}>{logs}</div>
        </div>
      </div>
    </div>
  );
};

export default TotalErrorGraphPopup;

