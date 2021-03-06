import Vue from 'vue'
import store from '@/store/index';
import api from '@/config/api';
import axios from '@/config/axios.config';
import Router from "vue-router";
import landRoutes from '@/router/landRoutes';
import foodRoutes from '@/router/foodRoutes';
import myRouters from '@/router/myRoutes';
const momentPublish = r => require.ensure([], () => r(require('../page/moment/momentPublish')), 'momentPublish');
const momentDetails = r => require.ensure([], () => r(require('../page/moment/momentDetails')), 'momentDetails');
const activityDetails = r => require.ensure([], () => r(require('../page/activity/activityDetails')), 'activityDetails');
const wikiDetails = r => require.ensure([], () => r(require('../page/wiki/wikiDetails')), 'wikiDetails');
const landTopList = r => require.ensure([], () => r(require('../page/ranking/landTopList')), 'landTopList');
const liveTelecast = r => require.ensure([], () => r(require('../page/live/liveTelecast')), 'liveTelecast');
const liveRoom = r => require.ensure([], () => r(require('../page/live/liveRoom')), 'liveRoom');


Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    ...landRoutes,
    ...foodRoutes,
    ...myRouters,
    {
      path: '/sendMoment', // 发布圈子
      component: momentPublish,
      meta: {
        keepAlive: true,
        index: 0
      }
    },
    {
      path: '/momentDetails', // 圈子详情
      component: momentDetails,
      meta: {
        keepAlive: true,
        index: 0
      }
    },
    {
      path: '/activityDetails', // 活动详情
      component: activityDetails,
      meta: {
        keepAlive: true,
        index: 0
      }
    },
    {
      path: '/wikiDetails', // 百科详情
      component: wikiDetails,
      meta: {
        keepAlive: true,
        index: 1
      }
    },
    {
      path: '/landTopList', // 排行榜
      component: landTopList,
      meta: {
        keepAlive: true,
        index: 0
      }
    },
    {
      path: '/liveTelecast', // 直播
      component: liveTelecast,
      meta: {
        keepAlive: true,
        index: 0
      }
    },
    {
      path: '/liveRoom', // 直播间
      component: liveRoom,
      meta: {
        keepAlive: false,
        index: 1
      }
    },
  ],
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition ||0}
    }
  }
});

router.beforeEach((to, from, next) => {
  // 路由拦截逻辑
  if (!Object.values(store.state.config).length) {
    axios.post(api.common.dimList).then(res => {
      store.commit('setConfig', res.data.data);
      store.commit('updateConfig');
      next()
    })
  } else {
    let toDay = new Date().getTime()
    if (store.state.localCreateDate + 24*3600*1000 < toDay) {
      axios.post(api.common.dimList).then(res => {
        store.commit('setConfig', res.data.data);
        store.commit('updateConfig');
        next()
      })
    } else {
      next()
    }
  }
});

export default router
