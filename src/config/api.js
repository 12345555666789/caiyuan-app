import IP from './ip.config'
const key = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const prefix = IP[key];
const gardenPrefix = prefix + /garden/;

const garden = {
  gardenList: gardenPrefix + 'list',
  landRegionList: gardenPrefix + 'land_region/list',
  getGardenInfo: gardenPrefix + 'details/',
  getlandDetails: gardenPrefix + 'land_region/details/'

};

const api = {
  garden
};

export default api
