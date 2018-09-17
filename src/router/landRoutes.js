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
  },
  {
    path: '/chooseSeed', // 选择种子
    component: chooseSeed,
    meta: { keepAlive: true },
  },
  {
    path: '/chooseFertilizers', // 选择选择肥料
    component: chooseFertilizers,
    meta: { keepAlive: true },
  },
  {
    path: '/seedDetails', // 种子详情
    component: seedDetails,
    meta: { keepAlive: true },
  },
  {
    path: '/fertilizerDetails', // 肥料详情
    component: fertilizerDetails,
    meta: { keepAlive: true },
  },
  {
    path: '/valueAddedService', // 增值服务
    component: valueAddedService,
    meta: { keepAlive: true },
  },
  {
    path: '/landBill', // 提交账单
    component: landBill,
    meta: { keepAlive: true },
  }
];

export default landRoutes
