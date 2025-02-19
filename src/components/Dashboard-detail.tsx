// 각 데이터들을 나타내는 컴포넌트들이이 모여있는 상세페이지
// 구성 :
// Nav-bar.tsx, Board-packet.tsx, Board-ports.tsx, Board-runtime.tsx, Board-status.tsx, Board-users.tsx
import './Nav-var.tsx'
import './Nav-bar-add.tsx';
import './Nav-bar-button.tsx';
import detail from './styles/dashboard-detail.module.scss';

const NavBar: React.FC = () => {

  return <div className={detail.navbar}>
    <NavBar></NavBar>
    <div className={detail.board}>
        <Board-rumtime></Board-rumtime>
        
    </div>
  </div>

}

export default NavBar;