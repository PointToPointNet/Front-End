import style from '../styles/total-login.module.scss';

interface LoginData {
  server_id: number;
  user: string;
  login_count: number;
  last_login_time: string;
}
interface SomeComponentProps {
  loginData: LoginData[];
}

const TotalLogin: React.FC<SomeComponentProps> = ({loginData}) => {
  if(!loginData){ return <div className={style.body}>Loading...</div> }
  return  <div className={style.body}>
  <p>total login user.</p>
  {loginData.map( (data,index)=>{
    return(<div key={index}>
      <span>{data.user} {data.login_count} {data.last_login_time}</span>
    </div>)
  } )}
</div>
    
  

}

export default TotalLogin;