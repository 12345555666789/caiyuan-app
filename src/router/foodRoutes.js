const makeFood = r => require.ensure([], () => r(require('../page/food/makeFood')), 'makeFood');
const chooseFood = r => require.ensure([], () => r(require('../page/food/chooseFood')), 'chooseFood');
const foodCar = r => require.ensure([], () => r(require('../page/food/foodCar')), 'foodCar');

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
  }
];

export default foodRoutes
