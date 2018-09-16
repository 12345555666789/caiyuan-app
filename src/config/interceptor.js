import axios from 'axios/index'
import { Toast } from 'vant';
// TODO 拦截器逻辑
axios.interceptors.request.use((config) => {
  try {
    config.headers['Authorization'] = window.app.getToken();
  } catch (e) {
    Toast('获取Token失败');
    console.log(e);
  }
  return config
}, (error) => {
  Toast('请求错误');
  return Promise.reject(error)
});
axios.interceptors.response.use((config) => {
}, (error, res) => {
  if (error.response && error.response.data.errMessage) {
    Toast(error.response.data.errMessage)
  } else {
    Toast('服务器错误')
  }
  return Promise.reject(error)
});

export default axios
