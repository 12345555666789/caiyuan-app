<template>
  <div style="height: 100vh;background-color: #fff">
    <van-nav-bar
      title="菜篮"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw; background-color: #fff"></div>
    <div v-if="Object.values(foodCar).length">
      <div class="foodItem" v-for="item in foodCar" @click="tofoodInfo(item.foodId)">
        <div class="foodPic">
          <img v-lazy="item.foodPics[0]">
        </div>
        <div class="foodInfo">
          <div class="foodName">{{item.foodName}}</div>
          <div class="foodSpec">{{item.foodSpec}}</div>
          <div class="foodPrice"><span>¥</span>{{item.price}}</div>
          <div class="foodSeason"><span style="margin-right: 3vw">{{item.commentCount}}条评价</span><span>{{item.praiseRate}}%好评</span></div>
          <div class="addfood" v-if="carList && carList[item.foodId]">
            <div class="iconReduce"
                 @click.stop="reduceCar(item)"></div>
            <span class="foodNum">{{carList && carList[item.foodId].num}}</span>
            <van-icon name="add" @click.stop="addCar(item)"/>
          </div>
          <div class="foodCount" @click.stop="addCar(item)" v-else>
            <van-icon name="add" />
          </div>
        </div>
      </div>
      <div style="height: 12vw; background-color: #fff"></div>
    </div>
    <div v-else class="noData"><span>菜篮空空如也~</span></div>
    <div class="van-goods-action" v-if="Object.values(foodCar).length">
      <div class="totalPrice">总计预算：<span class="price"><span class="iconRmb">¥</span>{{price}}</span></div><div class="footerBtn entrustBtn" @click="orderSubmit">提交订单</div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

    export default {
      name: "foodCar",
      data () {
        return {
          price: 0,
          isLoading: false,
          carList: {}
        }
      },
      computed: {
        ...mapState(['foodCar', 'foodOrder']),
      },
      mounted () {
        this.foodCar ? this.carList = this.foodCar : null;
        this.totalPrice()
      },
      methods: {
        ...mapMutations([
          'addToFoodCar', 'reduceFoodToCar', 'setFoodTotalPrice'
        ]),
        totalPrice () {
          this.price = 0;
          Object.values(this.foodCar).forEach(item => {
            this.price += item.price * item.num;
          });
        },
        orderSubmit () {
          this.setFoodTotalPrice(this.price);
          this.$router.push({
            path: '/foodBill'
          })
        },
        addCar (data) {
          this.addToFoodCar(data);
          this.carList = this.foodCar;
          this.totalPrice()
        },
        reduceCar (data) {
          this.reduceFoodToCar(data);
          this.carList = this.foodCar;
          this.totalPrice()
        },
        onClickLeft() {
          window.history.back()
        }
      }
    }
</script>

<style scoped lang="less">
  .noData {
    font-size: 5vw;
    font-weight: 600;
    display: flex;
    height: 77vh;
    color: #5d5d5d;
    justify-content: center;
    justify-items: center;
    align-items: center;
  }
  .totalPrice {
    height: 10vw;
    width: 56vw;
    text-align: left;
    font-size: 3.5vw;
    line-height: 10vw;
    .price {
      color: #F12020;
      font-size: 4.5vw;
      font-weight: 600;
      overflow: hidden;
      display: inline-block;
      max-width: 31vw;
      vertical-align: middle;
      .iconRmb {
        font-size: 3vw;
      }
    }
  }
  .itemGoods {
    .addfood {
      height: 6vw;
      width: 20vw;
      font-size: 6vw;
      display: flex;
      justify-items: center;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: #38ACA5;
      border-radius: 50%;
      position: absolute;
      top: 4vw;
      right: 4vw;
      .foodNum {
        font-size: 3.8vw;
        margin: 0 auto;
        color: #555555;
      }
    }
  }
  .carNoData {
    height: 20vw;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    font-size: 4vw;
    color: #5e5e5e;
  }
  .itemGoods {
    position: relative;
    height: 15vw;
    display: flex;
    align-items: center;
    padding: 3vw 3vw;
    border-bottom: 1px solid #DFDFDF;
    .itemGoodsName {
      font-size: 4vw;
      font-weight: 600;
    }
  }
  .goodsCar {
    min-height: 50vw;
    max-height: 100vw;
    overflow: auto;
  }
  .iconCar {
    height: 15vw;
    width: 15vw;
    background: url("data:image/png;base64,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") no-repeat;
    background-size: 100% 100%;
    .totalNum {
      position: absolute;
      top: 1vw;
      right: 1vw;
      font-size: 3vw;
      color: #fff;
      border-radius: 13vw;
      background-color: #DE3B3B;
      padding: 0.8vw 1.8vw;
      min-width: 2vw;
      display: inline-block;
      text-align: center;
    }
  }

  .carBtn {
    border-radius: 50%;
    position: fixed;
    bottom: 15vw;
    right: 6vw;
    z-index: 9;
  }
  .addfood {
    height: 6vw;
    width: 20vw;
    font-size: 6vw;
    display: flex;
    justify-items: center;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #38ACA5;
    border-radius: 50%;
    position: absolute;
    top: 21.5vw;
    right: .1vw;
    .foodNum {
      font-size: 3.8vw;
      margin: 0 auto;
      color: #555555;
    }
  }
  .foodItem {
    background-color: #fff;
    padding-top: 5vw;
    padding-left: 4vw;
    padding-right: 4vw;
    display: flex;
    .foodPic {
      width: 28vw;
      height: 28vw;
      margin-right: 4vw;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .foodInfo {
      height: 28vw;
      width: 60vw;
      overflow: hidden;
      position: relative;
      .foodName {
        margin-bottom: 2vw;
        font-size: 4vw;
        font-weight: 700;
      }
      .foodSpec {
        margin-bottom: 4vw;
        font-size: 2.5vw;
        color: #959595;
      }
      .foodPrice {
        margin-bottom: 1vw;
        color: #F12020;
        font-size: 4vw;
        font-weight: 900;
        span {
          font-size: 3vw;
        }
      }
      .foodSeason {
        display: inline-block;
        color: #ADADAD;
        font-size: 2.5vw;
        text-align: center;
      }
      .foodCount {
        height: 6vw;
        width: 6vw;
        font-size: 6vw;
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #38ACA5;
        border-radius: 50%;
        position: absolute;
        top: 21.5vw;
        right: .1vw;
      }
    }
  }
  .van-tabbar-item--active {
    color: #38ACA5;
  }
  .van-tabbar-item.van-tabbar-item--active .van-tabbar-item__text {
    .van-icon-arrow {
      transform: rotate(90deg);
    }
  }
  .van-tabbar-item .van-tabbar-item__text {
    .van-icon-arrow {
      transform: rotate(-90deg);
      vertical-align: baseline;
      margin-left: 1.5vw;
      font-size: 2.5vw;
    }
  }
  .van-goods-action {
    padding: 1.5vw 4vw;
    background: #fff;
    border-top: 1px solid #E9E9E9;
    text-align: center;
    justify-items: center;
    .footerBtn {
      width: 36vw;
      height: 10vw;
      line-height: 10vw;
      font-size: 4vw;
      border-radius: 6vw;
      color: #fff;
    }
    .entrustBtn {
      background: #FF7070;
    }
  }
  .notLandRegionData {
    height: 60vw;
    text-align: center;
    color: #505050;
    display: flex;
    align-items: center;
    span {
      font-size: 5vw;
      flex: 1;
    }
  }
</style>
