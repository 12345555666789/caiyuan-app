import Vue from 'vue'
import Router from "vue-router";

Vue.use(Router);

const gardenList = r => require.ensure([], () => r(require('../page/garden/gardenList')), 'gardenList');
const gardenInfo = r => require.ensure([], () => r(require('../page/garden/gardenInfo')), 'gardenInfo');
const landRegionList = r => require.ensure([], () => r(require('../page/garden/landRegionList')), 'landRegionList');
const chooseGarden = r => require.ensure([], () => r(require('../page/garden/chooseGarden')), 'chooseGarden');

const routes = [
  {
    path: '/', // 默认页面=>我的菜园列表
    redirect: 'gardenList'
  },
  {
    path: '/gardenList', // 我的菜园列表
    component: gardenList,
    meta: { keepAlive: true },
  },
  {
    path: '/gardenInfo', // 菜园详情
    component: gardenInfo,
    meta: { keepAlive: true },
  },
  {
    path: '/landRegionList', // 农场列表
    component: landRegionList,
    meta: { keepAlive: true },
  },
  {
    path: '/chooseGarden', // 选择菜园
    component: chooseGarden,
    meta: { keepAlive: true },
  }
];

const router = new Router({
  mode: 'hash',
  routes,
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
