import Function from '@/util/function'

export const setLandData = (state, data) => {
  state.landData = data
};
export const clearLandOrder = (state, data) => {
  state.gardenOrder = data;
  state.gardenCar = data;
  state.landData = data;
};
export const setSelectedLands = (state, data) => {
  state.gardenOrder.landInfo = data;
};
export const setSowingMode = (state, data) => {
  state.gardenOrder.sowingMode = data
};
export const setCareMode = (state, data) => {
  state.gardenOrder.careMode = data
};
export const addToLandCar = (state, data) => {
  let car = state.gardenCar;
  if (data.seedId) {
    if (car && car[data.seedId]) {
      car[data.seedId].num ++;
    } else {
      if (car) {
        car[data.seedId] = {...data, num: 1}
      } else {
        car = {
          [data.seedId]: {...data, num: 1}
        }
      }
    }
  } else {
    if (car && car[data.fertId]) {
      car[data.fertId].num ++;
    } else {
      if (car) {
        car[data.fertId] = {...data, num: 1}
      } else {
        car = {
          [data.fertId]: {...data, num: 1}
        }
      }
    }
  }
  state.gardenCar = {...car};
};
export const reduceToCar = (state, data) => {
  let car = state.gardenCar;
  if (data.seedId) {
    if (car && car[data.seedId]) {
      if (car[data.seedId].num !== 1) {
        car[data.seedId].num --;
      } else {
        delete car[data.seedId]
      }
    }
  } else {
    if (car && car[data.fertId]) {
      if (car[data.fertId].num !== 1) {
        car[data.fertId].num --;
      } else {
        delete car[data.fertId]
      }
    }
  }
  state.gardenCar = {...car};
};
