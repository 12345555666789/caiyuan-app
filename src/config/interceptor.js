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
      config.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1aWQiOiIxMDM0Mzc0MzQ3MTA4OTk1MDcyIiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTUzOTkxNjgzMCwiaWF0IjoxNTM5MzEyMDMwfQ.q9L4JVoH3c6vzmkSXcoR42ERyf8u3Zt88tRGkzYJpfI';
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
