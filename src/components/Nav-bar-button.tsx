import { useState } from "react";
import { HiHome } from "react-icons/hi2";
import { RiComputerLine } from "react-icons/ri";
import style from '../styles/nav-bar.module.scss';

interface NavBarButtonProps {
  activeServer: string | null; // 현재 활성화된 서버 이름
  changeServer: (serverName: string) => void; // 서버를 변경하는 함수
  changePage: (serverName: string) => void; // 페이지를 변경하는 함수
  serverList: string[];
}

const NavBarButton: React.FC<NavBarButtonProps> = (props) => {


  const server = props.serverList.map((serverName, index) => (
    <li
      key={serverName}
      id={serverName}
      className={props.activeServer === serverName ? style.on : ""}
      onClick={() => { 
        props.changeServer(serverName); 
        props.changePage("detail");
      }}
    ><RiComputerLine /></li>
))

  return <div>
    <ul className={style.iconlist}>
      <li className={ props.activeServer == "home" ? style.on : ""} 
      onClick={ () => { 
        props.changeServer("home"); 
        props.changePage("home");
      }}
      ><HiHome /></li>
      {server}
    </ul>  
  </div>
}

export default NavBarButton;