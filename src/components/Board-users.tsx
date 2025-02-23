import style from '../styles/board-users.module.scss';
import { useEffect, useState } from 'react';

interface UserData {
  username: string;
  terminal: string;
  ip: string;
  loginTime: string;
  logoutTime: string;
  connecting: boolean;
}

interface BoardUsersProps {
  serverName: string;
}

const BoardUsers: React.FC<BoardUsersProps> = ({ serverName }) => {
  const [userList, setUserList] = useState<UserData[]>([]);

  useEffect(() => {
    //최초 실행
    fetch("http://localhost:3000/user_list")
    .then((response) => response.json())
    .then((data) => {
      for (let i=0; i<data.length; i++) {
        const serverNameData = data[i][serverName];
        if (serverNameData) {
          const users = serverNameData.map((user: UserData) => ({
            username: user.username,
            terminal: user.terminal,
            ip: user.ip,
            loginTime: user.loginTime,
            logoutTime: user.logoutTime,
            connecting: user.connecting,
          }));
          setUserList(users);
          break;
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

    //10분마다 실행
    const interval = setInterval(() => {
      fetch("http://localhost:3000/user_list")
        .then((response) => response.json())
        .then((data) => {
          for (let i=0; i<data.length; i++) {
            const serverNameData = data[i][serverName];
            if (serverNameData) {
              const users = serverNameData.map((user: UserData) => ({
                username: user.username,
                terminal: user.terminal,
                ip: user.ip,
                loginTime: user.loginTime,
                logoutTime: user.logoutTime,
                connecting: user.connecting,
              }));
              setUserList(users);
              break;
            }
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, 600000);
    return () => clearInterval(interval);
  }, [serverName]);

  return (
    <div className={style.body}>
      <div className={style.tableHeader}>
        <div>Name</div>
        <div>TTY</div>
        <div>IP / HOST</div>
        <div>Login / Logout Time </div>
        <div>Connecting</div>
        <div>Disconnect</div>
      </div>

      {userList.map((user, index) => (
        <div key={index} className={style.tableBody}>
          <div>{user.username}</div>
          <div>{user.terminal}</div>
          <div>{user.ip}</div>
          <div>{user.loginTime} / {user.logoutTime}</div>
          <div>{user.connecting ? "Connected" : "Disconnected"}</div>
          <div><button>연결끊기</button></div>
        </div>
      ))}
    </div>
  );
};

export default BoardUsers;
