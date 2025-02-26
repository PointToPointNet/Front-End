export interface TotalInfo {
    recorded_date: string;
    server_id: number;
    mem_avg: string;
    cpu_avg: string;
    rx_data: string;
    tx_data: string;
    total: string;
    web_access_count: number;
    web_error_count: number;
    ufw_count: number;
    auth_error_count: number;
    mysql_err_count: number;
  }
  
  export interface LoginInfo {
    server_id: number;
    user: string;
    login_count: number;
    last_login_time: string;
  }
  
  export interface CriticalLog {
    server_id: number;
    log_time: string;
    service: string;
    log_level: string;
    message: string;
  }
  
  export interface ApacheError {
    log_time: string;
    log_level: string;
    error_code: string;
    message: string;
  }
  
  export interface MysqlError {
    log_time: string;
    log_level: string;
    error_code: string;
    message: string;
  }
  
  export interface UfwError {
    log_time: string;
    src_ip: string;
    dst_ip: string;
    protocol: string;
    src_port: number | null;
    dst_port: number | null;
    action: string;
  }
  
  export interface AuthError {
    log_time: string;
    service: string;
    user: string;
    src_ip: string;
    action: string;
  }
  
  export interface DataObject {
    total_info: TotalInfo[];
    login_info: LoginInfo[];
    critical_log: CriticalLog[];
    select_apache_err: ApacheError[];
    select_mysql_err: MysqlError[];
    select_ufw_err: UfwError[];
    select_auth_err: AuthError[];
  }

  export interface ServerMapping {
    [key: string]: number;
  }