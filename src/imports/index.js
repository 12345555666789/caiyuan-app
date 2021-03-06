import '@/assets/css/public/style.less';
import router from '@/router';
import store from '@/store/index';
import Vant from 'vant';
import 'lrz/dist/lrz.all.bundle'
import 'vant/lib/vant-css/index.css';
import 'vant/lib/vant-css/icon-local.css';
import '@/assets/css/public/animate.css';
import { Lazyload } from 'vant';

import {util} from '@/plugins'

if (process.env.NODE_ENV === 'development') {
  require('@/mock')
}

export {
  router,
  Vant,
  util,
  store,
  Lazyload
}
