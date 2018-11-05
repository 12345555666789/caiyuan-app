import axios from 'axios/index';
import { Toast } from 'vant';
import store from '@/store'

// 拦截器逻辑
axios.interceptors.request.use((config) => {
  try {
    store.dispatch('setLoadingState', true);
    if (window.app.getToken && window.app.getToken()) {
      config.headers['Authorization'] = window.app.getToken() || null
    }
    // else {
    //   config.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJBUFAiLCJ1aWQiOiIxMDAwMDAwMDI1IiwiaXNzIjoiU2VydmljZSIsImV4cCI6MTU0MTc1NDM2NCwiaWF0IjoxNTQxMTQ5NTY0fQ.RWWwmric7LDCL816V74J6v5JHvdMtsJZu9f9c_BR2B0';
    // }
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
  if (error.response.status === 401) {
    Toast('Token已过期, 请重新登录');
    if (window.app.toLogin) {
      window.app.toLogin()
    } else {
      Toast('Native错误')
    }
  } else if (error.response && error.response.data.errMessage) {
      Toast(error.response.data.errMessage)
    } else {
      Toast('服务器错误')
    }
  return Promise.reject(error)
});

export default axios
