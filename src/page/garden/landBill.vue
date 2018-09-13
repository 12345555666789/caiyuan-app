<template>
    <div>
      <van-nav-bar
        title="账单详情"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-cell-group>
        <van-cell title="菜园名称"><div class="value">{{gardenOrder.landInfo.landName}}</div></van-cell>
        <van-cell title="菜园规格">
          <div class="value" v-for="item in setLandSpec"><span>{{item.landSpec}}㎡</span><span> × {{item.count}}</span></div>
        </van-cell>
        <van-cell title="租赁时间">
          <div class="value">{{gardenOrder.landInfo.startDate}}-{{gardenOrder.landInfo.endDate}}</div>
        </van-cell>
        <van-cell title="开垦模式"><div class="value">{{gardenOrder.landInfo.recMode === 0 ? '自理' : '托管'}}</div></van-cell>
        <van-cell title="肥料套餐">
          <div class="value" v-for="item in setCar.fertilizer"><span>{{item.fertName}}</span><span> × {{item.num}}</span></div>
        </van-cell>
        <van-cell title="作物种子">
          <div class="value" v-for="item in setCar.seed"><span>{{item.seedName}}</span><span> × {{item.num}}</span></div>
        </van-cell>
        <van-cell title="余额">
          <div class="value">{{balance}}</div>
        </van-cell>
        <van-cell title="优惠折扣">
          <!--<div class="value"><span>菜园折扣</span><span>{{getPreAccounting({}, 'landDiscount')}}{{landDiscount.discountRate}}</span></div>-->
          <!--<div class="value"><span>租赁折扣</span><span>{{getPreAccounting({}, 'dateDiscount')}}{{dateDiscount.discountRate}}</span></div>-->
          <!--<div class="value"><span>会员折扣</span><span>{{getPreAccounting({}, 'vipDiscount')}}{{vipDiscount.discountRate}}</span></div>-->
          <!--<div class="value"><span>合计折扣</span><span>{{getPreAccounting({}, 'total')}}{{total.discountRate}}</span></div>-->
        </van-cell>
      </van-cell-group>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">提交订单</div>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  export default {
      name: "landBill",
      data() {
        return {
          balance: '暂无余额',
          landDiscount: {
            discountRate: 0,
            totalCost: 0
          },
          dateDiscount: {
            discountRate: 0,
            totalCost: 0
          },
          vipDiscount: {
            discountRate: 0,
            totalCost: 0
          },
          total: {
            discountRate: 0,
            totalCost: 0
          }
        }
      },
      computed: {
        ...mapState(['gardenOrder', 'gardenCar']),
        setLandSpec () {
          let lands = {};
          this.gardenOrder.landInfo.lands.forEach(item => {
            if (lands[item.landSpec]) {
              lands[item.landSpec].count ++
            } else {
              lands[item.landSpec] = {landSpec: item.landSpec, count: 1}
            }
          });
          return lands
        },
        setCar () {
          let car = {
            seed: {},
            fertilizer: {}
          };
          Object.values(this.gardenCar).forEach(item => {
            if (item.seedId) {
              car.seed[item.seedId] = item
            }
            if (item.fertId) {
              car.fertilizer[item.fertId] = item
            }
          });
          return car
        }
      },
      mounted () {

      },
      methods: {
        getPreAccounting (order, type) {
          axios.post(api.order.getPreAccounting, {...order}).then(res => {
            return res.data.data
          }).catch(() => {
            this[type] = {
              discountRate: Math.round(Math.random()),
              totalCost: Math.round(Math.random()*1000)
            }
          })
        },
        nextStep () {
          // 提交订单
        },
        goBack () {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  .value {
    color: #505050;
  }
  .van-goods-action {
    padding: 1.5vw 4vw;
    background: #fff;
    border-top: 1px solid #E9E9E9;
    text-align: center;
    justify-content: center;
    justify-items: center;
    .footerBtn {
      width: 90vw;
      height: 9vw;
      line-height: 9vw;
      border-radius: 5vw;
      color: #fff;
    }
    .entrustBtn {
      background: #FF7070;
    }
  }
</style>
