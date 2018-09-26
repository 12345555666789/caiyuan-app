import IP from './ip.config'
const key = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const prefix = IP[key];
const gardenPrefix = prefix + /land/;
const commonPrefix = prefix + /common/;
const orderPrefix = prefix + /order/;
const foodPrefix = prefix + /food/;
const momentPrefix = prefix + /moment/;
const myPrefix = prefix + /my/;

const common = {
  getInfo: commonPrefix + 'detail',
  commentList: commonPrefix + 'comment/list',
  userAction: commonPrefix + 'user/action',
  uploadFile: commonPrefix + 'file/upload'
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
  submitFoodOrder: orderPrefix + 'food/submit'
};

const moment = {
  momentList : momentPrefix + 'list',
  momentPublish: momentPrefix + 'publish'
};

const my = {
  userInfo: myPrefix + 'info',
  landList: myPrefix + 'land/list'
};

const api = {
  garden,
  food,
  common,
  order,
  my,
  moment
};

export default api
