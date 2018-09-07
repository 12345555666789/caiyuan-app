import Function from '@/util/function'

export const setLandData = (state, data) => {
  state.landData = data
};
export const setSelectedLands = (state, data) => {
  state.gardenOrder.landInfo = data
};
export const addToLandCar = (state, data) => {
  if (data.seedId) {
    if (state.gardenOrder.car && state.gardenOrder.car[data.seedId]) {
      state.gardenOrder.car[data.seedId].num ++;
    } else {
      state.gardenOrder.car = {
        [data.seedId]: {...data, num: 1}
      };
    }
  } else {
    if (state.gardenOrder.car && state.gardenOrder.car[data.fertilizerId]) {
      state.gardenOrder.car[data.fertilizerId].num ++;
    } else {
      state.gardenOrder.car = {
        [data.fertilizerId]: {...data, num: 1}
      };
    }
  }
  Function.setStore('landCar', state.gardenOrder.car)
};
export const reduceToCar = (state, data) => {
  if (data.seedId) {
    if (state.gardenOrder.car && state.gardenOrder.car[data.seedId]) {
      if (state.gardenOrder.car[data.seedId].num !== 1) {
        state.gardenOrder.car[data.seedId].num --;
      } else {
        delete state.gardenOrder.car[data.seedId]
      }
    }
  } else {
    if (state.gardenOrder.car && state.gardenOrder.car[data.fertilizerId]) {
      if (state.gardenOrder.car[data.fertilizerId].num !== 1) {
        state.gardenOrder.car[data.fertilizerId].num --;
      } else {
        delete state.gardenOrder.car[data.fertilizerId]
      }
    }
  }
  Function.setStore('landCar', state.gardenOrder.car)
};
