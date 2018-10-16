import "babel-polyfill";
import App from '@/App.vue';
import Vue from 'vue';

import {
  router,
  Vant,
  util,
  store,
  Lazyload,
  VueVideoPlayer
} from '@/imports'

Vue.use(VueVideoPlayer);
Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(util);

Vue.config.productionTip = false;

const root = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
