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
  } else if (error.response && error.response.data.msg) {
      Toast(error.response.data.msg)
    } else {
      Toast('服务器错误')
    }
  return Promise.reject(error)
});

export default axios
