import IP from './ip.config'
const key = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const prefix = IP[key];
const gardenPrefix = prefix + /land/;
const commonPrefix = prefix + /common/;
const orderPrefix = prefix + /order/;
const foodPrefix = prefix + /food/;
const momentPrefix = prefix + /moment/;
const myPrefix = prefix + /my/;
const rankingPrefix = prefix + /ranking/;
const livePrefix = prefix + /live/;
const helpPrefix = prefix + /help/;
const msgPrefix = prefix + /message/;

const common = {
  getInfo: commonPrefix + 'detail',
  commentList: commonPrefix + 'comment/list',
  userAction: commonPrefix + 'user/action',
  uploadFile: commonPrefix + 'file/upload',
  dimList: commonPrefix + 'dim/list' // 数据字典/维表
};

const garden = {
  gardenList: gardenPrefix + 'list',
  landRegionList: gardenPrefix + 'farm/list',
  getLandDetails: gardenPrefix + 'farm/details/',
  getSeedList: gardenPrefix + 'seed/list',
  getFertilizerList: gardenPrefix + 'fertilizer/list',
};

const food = {
  getFoodTypes: foodPrefix + 'types',
  getFoodList: foodPrefix + 'list'
};

const order = {
  getPreAccounting: orderPrefix + 'land/pre_accounting',
  submitFoodOrder: orderPrefix + 'food/submit',
  submitLandOrder: orderPrefix + 'land/submit'
};

const live = {
  getInteractionTopList: livePrefix + 'act/list',
  getOnlineTopList: livePrefix + 'farm/list'
};

const moment = {
  momentList : momentPrefix + 'list',
  momentPublish: momentPrefix + 'publish'
};

const my = {
  userInfo: myPrefix + 'info',
  landList: myPrefix + 'land/list',
  orderList: myPrefix + 'order/list',
  orderFoodList: myPrefix + 'order/foodlist/',
  deleteOrder: myPrefix + 'order/delete/',
  cancelOrder: myPrefix + 'order/cancel/',
  deleteMoment: myPrefix + 'moment/delete/',
  refund: myPrefix + 'order/refund',
  getFavorList: myPrefix + 'favor/list'
};

const help = {
  msgList: helpPrefix + 'land/msglist/',
  list: helpPrefix + 'list',
  msgPublish: helpPrefix + 'land/msgpublish',
  complainPublish: helpPrefix + 'complain/publish'
};

const ranking = {
  landRanking: rankingPrefix + 'land',
  owerRanking: rankingPrefix + 'landower'
};

const msg = {
  msgList: msgPrefix + 'list'
};

const api = {
  garden,
  food,
  common,
  order,
  my,
  moment,
  ranking,
  live,
  help,
  msg
};

export default api
