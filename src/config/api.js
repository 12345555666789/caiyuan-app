import IP from './ip.config'
const key = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const prefix = IP[key];
const gardenPrefix = prefix + /land/;
const commonPrefix = prefix + /common/;
const orderPrefix = prefix + /order/;
const foodPrefix = prefix + /food/;

const common = {
  getInfo: commonPrefix + 'detail/',
  commentList: commonPrefix + 'comment/list/',
  userAction: commonPrefix + 'user/action'
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
};

const api = {
  garden,
  food,
  common,
  order
};

export default api
