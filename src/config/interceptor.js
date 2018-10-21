import axios from 'axios/index';
import { Toast } from 'vant';
import store from '@/store'

// 拦截器逻辑
axios.interceptors.request.use((config) => {
  try {
    store.dispatch('setLoadingState', true);
    if (window.app.getToken) {
      config.headers['Authorization'] = window.app.getToken()
    } else {
      config.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1aWQiOiIxMDAwMDAwMDI0IiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTU0MDcwMTgyMCwiaWF0IjoxNTQwMDk3MDIwfQ.-_24JEmRy0enOAWPVyHH1cqhchaRd8S2kb15xaSklSY';
    }
  } catch (e) {
    store.dispatch('setLoadingState', false);
    console.log(e);
  }
  return config
}, (error) => {
  Toast('请求错误');
  store.dispatch('setLoadingState', false);
  return Promise.reject(error)
});
axios.interceptors.response.use((config) => {
  store.dispatch('setLoadingState', false);
  return config
}, (error, res) => {
  store.dispatch('setLoadingState', false);
  if (error.response && error.response.data.errMessage) {
    Toast(error.response.data.errMessage)
  } else {
    Toast('服务器错误')
  }
  return Promise.reject(error)
});

export default axios
