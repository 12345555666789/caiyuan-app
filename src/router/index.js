import Vue from 'vue'
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
  // TODO 路由拦截逻辑
  // ...
  next()
});

export default router
