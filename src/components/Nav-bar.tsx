// 왼쪽 사이드 이동 버튼
// 구성 :
// Nav-bar-add.tsx, Nav-bar-button.tsx

//import NavBarAdd from './Nav-bar-add.tsx';
import github from '../assets/github.png';
import pdf from '../assets/pdf.png';
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

      <div className={style.source}>
        <a href="#" className={style.btn}>
          <img src={github} alt="깃허브 코드보기" />
          깃허브
        </a>
        <a href="#" className={style.btn} >
          <img src={pdf} alt="문서보기" />
          문서보기
        </a>
      </div>
  </div>

}

export default NavBar;
