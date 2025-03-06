// 왼쪽 사이드 이동 버튼
// 구성 :
// Nav-bar-add.tsx, Nav-bar-button.tsx

//import NavBarAdd from './Nav-bar-add.tsx';
import github from '../assets/github.png';
import print from '../assets/printer.png';
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
  interface PrintOptions {
    printTitle: string;
    landscape: boolean;
  }


  return <div className={style.navbar}>
    {/*<NavBarAdd></NavBarAdd>*/}
    <div>{props.love}</div>
    <NavBarButton
      activeServer={props.activeServer}
      changeServer={(server) => {
        props.changeServer(server);
      }}
      changePage={(page) => {
        props.changePage(page);
      }}
      serverList={props.serverList}
    ></NavBarButton>


    <div className={style.source}>
      <a href="#" className={style.btn} onClick={(e) => {
        e.preventDefault();
        window.print({ printTitle: "Network Dashboard", landscape: false });
      }}>
        <img src={print} alt="프린트하기" />
        화면출력
      </a>
      <a href="https://github.com/PointToPointNet" className={style.btn} target='_blank'>
        <img src={github} alt="깃허브 코드보기" className={style.git} />
        깃허브
      </a>
      <a href="http://kkms4001.iptime.org/~c21st11/Portfolio/network_dashboard/Network%20Dashboard_team3.pdf" className={style.btn} target='_blank'>
        <img src={pdf} alt="문서보기" />
        문서보기
      </a>
    </div>
  </div>

}

export default NavBar;
