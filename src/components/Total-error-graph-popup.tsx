import style from "../styles/total-error-graph-popup.module.scss";

const TotalErrorGraphPopup = ({ closePopup, apacheErr }) => {
  console.log("*************************");
  console.log(apacheErr);
  console.log("*************************");
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <div className={style.buttonArea}>
          <button>WEB_ERROR</button>
          <button>MYSQL_ERROR</button>
          <button>UFW</button>
          <button>AUTH_ERROR</button>
          <button
            className={style.closeBtn}
            onClick={() => {
              closePopup();
            }}
          >
            X
          </button>
        </div>
        <div className={style.contentArea}>
          <div className={style.tableHeader}>
            <div>LOG_TIME</div>
            <div>LOG_LEVEL</div>
            <div>ERROR_CODE</div>
            <div>MESSAGE</div>
          </div>
          <div className={style.contents}>
            {apacheErr.map((data, index) => {
              return (
                <div key={index} className={style.tableBody}>
                  <div>
                    {data.log_time.split("T")[0]}{" "}
                    {data.log_time.split("T")[1].substring(0, 8)}
                  </div>
                  <div>{data.log_level}</div>
                  <div>{data.error_code}</div>
                  <div>{data.message}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalErrorGraphPopup;

// const colorValues = ['#C3E1FF', '#B91293', '#9747FF', '#FFD7A3' ];
