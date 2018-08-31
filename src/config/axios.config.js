import axios from './interceptor'
import ip from '@/config/ip.config'
const config = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
axios.defaults = {
  url: '/list',
  method: 'get',
  baseURL: ip[config]
};
export default axios
