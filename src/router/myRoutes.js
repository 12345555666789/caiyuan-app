const orderList = r => require.ensure([], () => r(require('../page/my/orderList')), 'orderList');
const messageList = r => require.ensure([], () => r(require('../page/my/messageList')), 'messageList');
const invite = r => require.ensure([], () => r(require('../page/my/invite')), 'invite');
const collection = r => require.ensure([], () => r(require('../page/my/collection')), 'collection');
const wallet = r => require.ensure([], () => r(require('../page/my/wallet')), 'wallet');

const myRoutes = [
  {
    path: '/orderList', // 我的订单
    component: orderList,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/messageList', // 消息列表
    component: messageList,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/invite', // 邀请好友
    component: invite,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/collection', // 收藏列表
    component: collection,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/wallet', // 我的钱包
    component: wallet,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
];

export default myRoutes