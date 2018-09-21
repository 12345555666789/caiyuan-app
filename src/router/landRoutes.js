const gardenList = r => require.ensure([], () => r(require('../page/garden/gardenList')), 'gardenList');
const gardenInfo = r => require.ensure([], () => r(require('../page/garden/gardenInfo')), 'gardenInfo');
const landRegionList = r => require.ensure([], () => r(require('../page/garden/landRegionList')), 'landRegionList');
const chooseGarden = r => require.ensure([], () => r(require('../page/garden/chooseGarden')), 'chooseGarden');
const chooseSeed = r => require.ensure([], () => r(require('../page/garden/chooseSeed')), 'chooseSeed');
const chooseFertilizers = r => require.ensure([], () => r(require('../page/garden/chooseFertilizers')), 'chooseFertilizers');
const seedDetails = r => require.ensure([], () => r(require('../page/garden/seedDetails')), 'seedDetails');
const fertilizerDetails = r => require.ensure([], () => r(require('../page/garden/fertilizerDetails')), 'fertilizerDetails');
const valueAddedService = r => require.ensure([], () => r(require('../page/garden/valueAddedService')), 'valueAddedService');
const landBill = r => require.ensure([], () => r(require('../page/garden/landBill')), 'landBill');
const landRoutes = [
  {
    path: '/', // 默认页面=>我的菜园列表
    redirect: 'gardenList'
  },
  {
    path: '/gardenList', // 我的菜园列表
    component: gardenList,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/gardenInfo', // 菜园详情
    component: gardenInfo,
    meta: {
      keepAlive: true,
      index: 1
    },
  },
  {
    path: '/landRegionList', // 农场列表
    component: landRegionList,
    meta: {
      keepAlive: true,
      index: 2
    },
  },
  {
    path: '/chooseGarden', // 选择菜园
    component: chooseGarden,
    meta: {
      keepAlive: true,
      index: 3
    },
  },
  {
    path: '/chooseSeed', // 选择种子
    component: chooseSeed,
    meta: {
      keepAlive: true,
      index: 4
    },
  },
  {
    path: '/chooseFertilizers', // 选择选择肥料
    component: chooseFertilizers,
    meta: {
      keepAlive: true,
      index: 6
    },
  },
  {
    path: '/seedDetails', // 种子详情
    component: seedDetails,
    meta: {
      keepAlive: true,
      index: 5
    },
  },
  {
    path: '/fertilizerDetails', // 肥料详情
    component: fertilizerDetails,
    meta: {
      keepAlive: true,
      index: 7
    },
  },
  {
    path: '/valueAddedService', // 增值服务
    component: valueAddedService,
    meta: {
      keepAlive: true,
      index: 8
    },
  },
  {
    path: '/landBill', // 提交账单
    component: landBill,
    meta: {
      keepAlive: true,
      index: 9
    },
  }
];

export default landRoutes
