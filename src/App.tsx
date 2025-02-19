import { useState } from 'react';
import './App.css';
import detail from './styles/dashboard-detail.module.scss';

const App: React.FC = () => {
  
  return <div className={detail.container}>
    <Dashboard-detail></Dashboard-detail>
  </div>

}

export default App;
