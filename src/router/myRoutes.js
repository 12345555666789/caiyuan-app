const orderList = r => require.ensure([], () => r(require('../page/my/orderList')), 'orderList');
const messageList = r => require.ensure([], () => r(require('../page/my/messageList')), 'messageList');
const invite = r => require.ensure([], () => r(require('../page/my/invite')), 'invite');
const collection = r => require.ensure([], () => r(require('../page/my/collection')), 'collection');
const wallet = r => require.ensure([], () => r(require('../page/my/wallet')), 'wallet');
const toBeVip = r => require.ensure([], () => r(require('../page/my/toBeVip')), 'toBeVip');
const evaluationFood = r => require.ensure([], () => r(require('../page/my/evaluationFood')), 'evaluationFood');
const messageBoard = r => require.ensure([], () => r(require('../page/my/messageBoard')), 'messageBoard');
const help = r => require.ensure([], () => r(require('../page/my/help')), 'help');
const messageDetails = r => require.ensure([], () => r(require('../page/my/messageDetails')), 'messageDetails');
const suggestion = r => require.ensure([], () => r(require('../page/my/suggestion')), 'suggestion');
const FAQ = r => require.ensure([], () => r(require('../page/my/FAQ')), 'FAQ');
const purchaseCompletion = r => require.ensure([], () => r(require('../page/my/purchaseCompletion')), 'purchaseCompletion');

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
    path: '/purchaseCompletion', // 购买完成
    component: purchaseCompletion,
    meta: {
      keepAlive: true,
      index: 1
    },
  },
  {
    path: '/help', // 客服与帮助
    component: help,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/suggestion', // 投诉建议
    component: suggestion,
    meta: {
      keepAlive: true,
      index: 1
    },
  },
  {
    path: '/FAQ', // 常见问题
    component: FAQ,
    meta: {
      keepAlive: true,
      index: 1
    },
  },
  {
    path: '/evaluationFood', // 评价订单
    component: evaluationFood,
    meta: {
      keepAlive: true,
      index: 2
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
    path: '/messageDetails', // 消息详情
    component: messageDetails,
    meta: {
      keepAlive: true,
      index: 1
    },
  },
  {
    path: '/invite', // 邀请好友
    component: invite,
    meta: {
      keepAlive: true,
      index: 2
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
  {
    path: '/toBeVip', // 成为会员
    component: toBeVip,
    meta: {
      keepAlive: true,
      index: 0
    },
  },
  {
    path: '/messageBoard', // 留言板
    component: messageBoard,
    meta: {
      keepAlive: true,
      index: 2
    },
  },
];

export default myRoutes
