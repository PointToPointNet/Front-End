import {useState} from 'react';
import style from "../styles/total-login.module.scss";
import { IoMdHelpCircleOutline } from "react-icons/io";

interface LoginData {
  server_id: number;
  user: string;
  login_count: number;
  last_login_time: string;
}
interface SomeComponentProps {
  loginData: LoginData[];
}

const TotalLogin: React.FC<SomeComponentProps> = ({ loginData }) => {
  if (!loginData) {
    return <div className={style.body}>Loading...</div>;
  }
  const [helperVisible, setHelperVisible] = useState(false);

  return (
    <div className={style.body}>
      <h2>👤Weekly User Login Status</h2>
        <div className={style.tableHeader}>
          <div>USER</div>
          <div>ACCESS_CNT</div>
          <div>LAST_LOGIN_TIME</div>
        </div>
        <div className={style.container}>
        {loginData.map((data, index) => {
          return (
            <div key={index} className={style.tableBody}>
              <div>{data.user}</div>
              <div>{data.login_count}</div>
              <div>
                {data.last_login_time.split("T")[0]}{" "}
                {data.last_login_time.split("T")[1].substring(0, 8)}
              </div>
            </div>
          );
        })}
      </div>
      <button
        className={style.helpBtn}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <IoMdHelpCircleOutline />
      </button>
      <div
        className={style.helper}
        style={{ display: helperVisible ? "flex" : "none" }}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <p className={style.help}>
        사용자별 주간 로그인 이력을 표로 보여줍니다.
        </p>
        <p className={style.help}>
        사용자가 일주일 동안 얼마나 자주 접속했는지 파악하여 보안 및 사용자 관리를 개선할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default TotalLogin;
