// 왼쪽 사이드 이동 버튼
// 구성 :
// Nav-bar-add.tsx, Nav-bar-button.tsx

//import NavBarAdd from './Nav-bar-add.tsx';

import NavBarButton from './Nav-bar-button.tsx';
import style from '../styles/nav-bar.module.scss';

interface NavBarProps {
  activeServer: string | null; // 현재 활성화된 서버 이름
  serverList: string[];
  changeServer: (serverName: string) => void; // 서버를 변경하는 함수
  changePage: (serverName: string) => void; // 페이지를 변경하는 함수
}

const NavBar: React.FC<NavBarProps> = (props) => {

  

  return <div className={style.navbar}>
    {/*<NavBarAdd></NavBarAdd>*/}
    <NavBarButton 
      activeServer={props.activeServer} 
      changeServer={(server)=>{
        props.changeServer(server);
      }}
      changePage={(page)=>{
        props.changePage(page);
      }}
      serverList={props.serverList}
      ></NavBarButton>
  </div>

}

export default NavBar;
