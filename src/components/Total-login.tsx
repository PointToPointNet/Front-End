import style from "../styles/total-login.module.scss";

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
  return (
    <div className={style.body}>
      <h2>Login Logs</h2>
      <div className={style.container}>
        <div className={style.tableHeader}>
          <div>USER</div>
          <div>ACCESS_COUNT</div>
          <div>LAST_LOGIN_TIME</div>
        </div>
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
    </div>
  );
};

export default TotalLogin;
