import { useState } from 'react';
import './App.css';
import DashboardDetail from './components/Dashboard-detail.tsx';
import detail from './styles/dashboard-detail.module.scss';

const App: React.FC = () => {
  
  return <div className={detail.container}>
    <DashboardDetail></DashboardDetail>
  </div>

}

export default App;
