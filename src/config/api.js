import IP from './ip.config'
const key = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const prefix = IP[key];
const gardenPrefix = prefix + /land/;
const commonPrefix = prefix + /common/;

const common = {
  getInfo: commonPrefix + 'detail/',
  commentList: commonPrefix + 'comment/list/',
  userAction: commonPrefix + 'user/action'
};
const garden = {
  gardenList: gardenPrefix + 'list',
  landRegionList: gardenPrefix + 'farm/list',
  getLandDetails: gardenPrefix + 'farm/details/',
  getSeedList: gardenPrefix + '/seed/list',
  getFertilizerList: gardenPrefix + '/fertilizer/list'

};

const api = {
  garden,
  common
};

export default api
