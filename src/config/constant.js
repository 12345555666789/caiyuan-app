// 定义常量

export default {
  landYearsMin: 1, // 订单最小年限
  landYearsMax: 5, // 订单最大年限
  orderLandMax: 5, // 订购土地上限
  toVIPPrice: 50, // 注册VIP金额
  sortType: {
    overall: -1, // 综合
    stockUp: 10, // 库存升序
    stockDown: 11, // 库存降序
    priceUp: 40, // 价格升序
    priceDown: 41, // 价格降序
    viewUp: 20, // 浏览数升序
    viewDown: 21, // 浏览数降序
    commentsUp: 30, // 评论数升序
    commentsDown: 31, // 评论数降序
    scaleUp: 50, // 规模升序
    scaleDown: 51, // 规模降序
    consumeUp: 60, // 消费升序
    consumeDown: 61 // 消费降序
  },
  seedType: {
    nativeVariety: 1, // 农家品种
    importedVarieties: 2, // 引进品种
    conventionalVarieties: 3, // 常规品种
    nutritiveVarieties: 4 // 引进品种
  },
  actionType: {
    comment: 1,//评论；
    forward: 2,//分享；
    like: 3,//点赞；
    favor: 4,//收藏；
    view: 5 //浏览
  },
  infoType: {
    moment: 10, //圈子
    activity: 11, //活动
    food: 12, //食材
    wiki: 13, //百科
    land: 14, //菜园
    msg: 15, //消息
    farm: 16, //农场
    seed: 17, //种苗
    fertilizer: 18, //肥料
    orderLand: 50, //菜园订单
    oderFood: 51 //食材订单
  },
  orderStates: [
    {
      "code": 10,
      "name": "待付款"
    },
    {
      "code": 11,
      "name": "付款中"
    },
    {
      "code": 20,
      "name": "已付款"
    },
    {
      "code": 30,
      "name": "已取消"
    },
    {
      "code": 40,
      "name": "已退款"
    },
    {
      "code": 41,
      "name": "退款中"
    },
    {
      "code": 50,
      "name": "已结束"
    }
  ],
  foodOrderStates: [
    {
      "code": 10,
      "name": "预约中"
    },
    {
      "code": 20,
      "name": "已预约"
    },
    {
      "code": 30,
      "name": "已取消"
    }
  ]
}
