import './App.css';
import NavBar from './components/Nav-bar.tsx';
import DashboardDetail from './components/Dashboard-detail.tsx';
import style from './styles/dashboard-detail.module.scss';

const App: React.FC = () => { 
  return <div className={style.container}>
    <div className={style.navbar}>
            <NavBar></NavBar>
    </div>
    <DashboardDetail></DashboardDetail>
  </div>

}

export default App;
