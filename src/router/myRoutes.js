const orderList = r => require.ensure([], () => r(require('../page/my/orderList')), 'orderList');

const myRoutes = [
  {
    path: '/orderList', // 我的订单
    component: orderList,
    meta: {
      keepAlive: true,
      index: 0
    },
  }
];

export default myRoutes
