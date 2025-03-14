import { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { IoAlertCircle } from "react-icons/io5";
import style from '../styles/board-users.module.scss';
import { IoMdHelpCircleOutline } from "react-icons/io";
import url from "../assets/config/url.ts";

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
  const [helperVisible, setHelperVisible] = useState(false);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [visible, setVisible] = useState<number | null>(null);
  useEffect(() => {
    //최초 실행
    fetch(`${url.url}/user_list`)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          const serverNameData = data[i][serverName];
          // console.log(data[i][serverName])
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
          for (let i = 0; i < data.length; i++) {
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



  const disconnectUser = (index: number) => {
    // console.log({ [serverName]: { username } });
    const newUserList = [...userList];
    newUserList[index].connecting = false;
    setUserList(newUserList);
    setVisible(null);
    // 만약 아래코드를 주석 풀면 백쪽에서 원격 실제로 끊을 수 있게
    // fetch("http://localhost:3000/force_disconnect", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ [serverName]: { username } }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.success) {
    //       const newUserList = [...userList];
    //       newUserList[index].connecting = false;
    //       setUserList(newUserList);
    //     } else {
    //       console.error("Failed to disconnect user:", data.message);
    //     }
    //   })
    //   .catch((error) => console.error("Error disconnecting user:", error));


    // 이게 실제로 백쪽에서 접속 끊을 수 있는 코드
    //     const { exec } = require("child_process");

    // const disconnectUser = (username) => {
    //   exec(`sudo pkill -KILL -u ${username}`, (err, stdout, stderr) => {
    //     if (err) {
    //       console.error("Error disconnecting user:", stderr);
    //       return;
    //     }
    //     console.log(`${username} disconnected successfully.`);
    //   });
    // };
    // disconnectUser("username");
    //   };

  }

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

      <div className={style.tBody}>
        {userList.map((user, index) => (
          <div key={index} className={style.tableBody}>
            <div>{user.username}</div>
            <div>{user.terminal}</div>
            <div>{user.ip}</div>
            <div>{user.loginTime} / {user.logoutTime}</div>
            <div id="connecting">{user.connecting ? "🟢" : "🔴"}</div>
            <div>
              {user.connecting ? (<button onClick={() => setVisible(index)} className={style.disconnectbtn}>Disconnect</button>) : ""}
            </div>
            {visible === index && (
              <div className={style.modal}>
                <div className={style.popup}>
                  <p>해당 유저의 상태를 <span>비활성화</span> 하시겠습니까?</p>
                  <p>유저의 원격연결이 끊깁니다.</p>
                  <div className={style.popupBtn}>
                    <button onClick={() => setVisible(null)}>Cancel</button>
                    <button onClick={() => disconnectUser(index)}>Yes! Disconnect</button>
                  </div>
                  <div className={style.close} onClick={() => setVisible(null)}><IoClose /></div>
                  <div className={style.alert}><IoAlertCircle /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={style.helpBtn} onClick={() => { setHelperVisible(!helperVisible) }}><IoMdHelpCircleOutline /></button>
      <div className={style.helper} style={{ display: helperVisible ? "flex" : "none" }} onClick={() => { setHelperVisible(!helperVisible) }}>
        <p className={style.help}>유저가 원격으로 접속한 정보를를 리스트 형식으로 나타냅니다.</p>
        <p className={style.help}>Name : User Id 정보를 나타냅니다.</p>
        <p className={style.help}>IP/HOST : User IP 정보를 나타냅니다.</p>
        <p className={style.help}>Connecting : 유저가 서버에 원격 접속 중인지 여부를 나타냅니다.(초록 : 접속중 / 빨강 : 미접속중)</p>
        <p className={style.help}>Disconnect : 원격 접속 상태의 유저를 강제로 연결 해제하는 버튼입니다.</p>
      </div>
    </div>
  );
}

export default BoardUsers;
