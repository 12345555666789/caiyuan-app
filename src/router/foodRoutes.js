const makeFood = r => require.ensure([], () => r(require('../page/food/makeFood')), 'makeFood');
const chooseFood = r => require.ensure([], () => r(require('../page/food/chooseFood')), 'chooseFood');
const foodCar = r => require.ensure([], () => r(require('../page/food/foodCar')), 'foodCar');
const foodBill = r => require.ensure([], () => r(require('../page/food/foodBill')), 'foodBill');
const foodDetails = r => require.ensure([], () => r(require('../page/food/foodDetails')), 'foodDetails');

const foodRoutes = [
  {
    path: '/makeFood', // 预约美食
    component: makeFood,
    meta: { keepAlive: true },
  },
  {
    path: '/chooseFood', // 选择食材
    component: chooseFood,
    meta: { keepAlive: true },
  },
  {
    path: '/foodCar', // 菜篮(购物车)
    component: foodCar,
    meta: { keepAlive: true },
  },
  {
    path: '/foodBill', // 美食定单
    component: foodBill,
    meta: { keepAlive: true },
  },
  {
    path: '/foodDetails', // 食材详情
    component: foodDetails,
    meta: { keepAlive: true },
  }
];

export default foodRoutes
