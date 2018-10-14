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
export const setFoodTotalPrice = (state, data) => {
  state.foodOrder.total = data
};
export const clearFert = (state) => {
  let food = state.gardenCar;
  Object.values(food).forEach(item => {
    if (item.fertId) {
      delete food[item.fertId]
    }
  });
  state.gardenCar = {...food}
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
export const reduceLandToCar = (state, data) => {
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
export const addToFoodCar = (state, data) => {
  let car = state.foodCar;
  if (data.foodId) {
    if (car && car[data.foodId]) {
      car[data.foodId].num ++;
    } else {
      if (car) {
        car[data.foodId] = {...data, num: 1}
      } else {
        car = {
          [data.foodId]: {...data, num: 1}
        }
      }
    }
  }
  state.foodCar = {...car};
};
export const reduceFoodToCar = (state, data) => {
  let car = state.foodCar;
  if (data.foodId) {
    if (car && car[data.foodId]) {
      if (car[data.foodId].num !== 1) {
        car[data.foodId].num --;
      } else {
        delete car[data.foodId]
      }
    }
  }
  state.foodCar = {...car};
};
export const setUserAction = (state, data) => {
  let userAction = state.userAction;
  if (userAction[data.userId]) {

  } else {
    userAction[data.userId] = {
      actionType: data.actionType,
      objId: data.objId,
      objType: data.objType,
      userId: data.userId
    }
  }
  state.userAction = userAction
};
export const setUserInfo = (state, data) => {
  state.userInfo = data
};
export const setLoadingState = (state, data) => {
  console.log(state, data);
  state.windowLoading = data
};
