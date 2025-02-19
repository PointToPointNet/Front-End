// 왼쪽 사이드 이동 버튼
// 구성 :
// Nav-bar-add.tsx, Nav-bar-button.tsx

import './Nav-bar-add.tsx';
import './Nav-bar-button.tsx';
import nav from './styles/nav-bar.module.scss';

const NavBar: React.FC = () => {

  return <div className={nav.navbar}>
    <NavBarAdd></NavBarAdd>
    <NavBarButton></NavBarButton>
  </div>

}

export default NavBar;
