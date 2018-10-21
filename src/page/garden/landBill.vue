<template>
    <div style="height: 100vh; width: 100vw; background: #fff;">
      <van-nav-bar
        title="订单详情"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 11vw"></div>
      <van-cell-group>
        <van-cell title="菜园名称"><div class="value">{{gardenOrder.landInfo.landName}}</div></van-cell>
        <van-cell title="菜园规格">
          <div class="value" v-for="item in setlandSize"><span>{{item.landSize}}平米</span><span> × {{item.count}}</span></div>
        </van-cell>
        <van-cell title="租赁时间">
          <div class="value">{{gardenOrder.landInfo.startDate}}-{{gardenOrder.landInfo.endDate}}</div>
        </van-cell>
        <van-cell title="开垦模式"><div class="value">{{gardenOrder.landInfo.recMode === 0 ? '自理' : '托管'}}</div></van-cell>
        <van-cell title="肥料套餐" v-if="Object.values(setCar.fertilizer)">
          <div class="value" v-for="item in setCar.fertilizer"><span>{{item.fertName}}</span><span> × {{item.num}}</span></div>
        </van-cell>
        <van-cell title="作物种子">
          <div class="value" v-for="item in setCar.seed"><span>{{item.seedName}}</span><span> × {{item.num}}</span></div>
        </van-cell>
        <van-cell title="增值服务">
          <div class="value"><span>播种方式</span><span> : {{gardenOrder.sowingMode}}</span></div>
          <div class="value"><span>养护方式</span><span> : {{gardenOrder.careMode}}</span></div>
        </van-cell>
        <van-cell title="余额">
          <div v-if="userInfo && userInfo.balance" class="value"><span class="iconRmb">¥</span>{{userInfo && userInfo.balance}}</div>
          <div class="value" v-else><span>暂无可用</span></div>
        </van-cell>
        <van-cell title="优惠折扣">
          <div class="value discountRate" style="margin-bottom: 1vw;"><span class="discountRateName">菜园折扣</span><span class="discountRateVal">{{(landDiscount.discountRate * 10).toFixed(1)}}折</span></div>
          <div class="value discountRate" style="margin-bottom: 1vw;"><span class="discountRateName">租赁折扣</span><span class="discountRateVal">{{(dateDiscount.discountRate * 10).toFixed(1)}}折</span></div>
          <div class="value discountRate" style="margin-bottom: 1vw;"><span class="discountRateName">会员折扣</span><span class="discountRateVal">{{userInfo && userInfo.discountRate.toFixed(1)}}折</span></div>
          <div class="dominantHueText discountRate"><span class="discountRateName">合计折扣</span><span class="discountRateVal">{{(total.discountRate * 10).toFixed(1)}}折</span></div>
        </van-cell>
        <van-cell>
          <div id="total">
            <p>
              <span class="totalLabel">应付金额: </span>
              <span class="totalPrice"><span class="iconRmb">¥</span>{{total.totalCost}}</span>
              <span v-if="total.discountRate">
                <span v-if="userInfo && userInfo.balance" class="originalCost"><span class="iconRmb">¥</span>{{Number(((Number(total.totalCost))/Number(total.discountRate)).toFixed(2)) + Number(userInfo && userInfo.balance)}}</span>
              <span v-else class="originalCost"><span class="iconRmb">¥</span>{{Number(((Number(total.totalCost))/Number(total.discountRate)).toFixed(2))}}</span>
              </span>
            </p>
          </div>
        </van-cell>
      </van-cell-group>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">提交订单</div>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex';
  import Function from '@/util/function'

  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import { Toast } from 'vant';

  export default {
      name: "landBill",
      data() {
        return {
          orderData: {
            lands: [],
            endDate: '',
            startDate: '',
            fertilizers: [],
            seeds: [],
            recMod: 1,
            sowingMode: 1,
            careMode: 1,
            totalCost: 0
          },
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
        ...mapState(['gardenOrder', 'gardenCar', 'userInfo']),
        setlandSize () {
          let lands = {};
          this.gardenOrder.landInfo.lands.forEach(item => {
            if (lands[item.landSize]) {
              lands[item.landSize].count ++
            } else {
              lands[item.landSize] = {landSize: item.landSize, count: 1, landId: item.landId}
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
        this.getUserInfo();
        window['buyFinish'] = (isDone) => {
          this.buyFinish(isDone)
        };
      },
      activated () {
        this.initPage()
      },
      methods: {
        ...mapMutations(['setUserAction', 'setUserInfo']),
        getUserInfo () {
          axios.post(api.my.userInfo).then(res => {
            this.setUserInfo(res.data.data);
          })
        },
        initPage () {
          this.gardenOrder.landInfo.lands.forEach(item => {
            this.orderData.lands.push(item.landId + "")
          });
          this.orderData.startDate = this.gardenOrder.landInfo.startDate;
          this.orderData.endDate = this.gardenOrder.landInfo.endDate;
          Object.values(this.setCar.fertilizer).forEach(item => {
            this.orderData.fertilizers.push({
              count: item.num,
              fertilizerId: item.fertId
            })
          });
          Object.values(this.setCar.seed).forEach(item => {
            this.orderData.seeds.push({
              count: item.num,
              seedId: item.seedId
            })
          });
          this.orderData.careMode = this.gardenOrder.careMode === '托管' ? 1 : 2;
          this.orderData.sowingMode = this.gardenOrder.sowingMode === '托管' ? 1 : 2;
          this.recMod = this.gardenOrder.recMod === '托管' ? 1 : 2;

          this.getPreAccounting({lands: this.orderData.lands}, 'landDiscount');
          this.getPreAccounting({
            startDate: this.orderData.startDate,
            endDate: this.orderData.endDate
          }, 'dateDiscount');
          this.getPreAccounting(this.orderData, 'total');
          this.orderData.landName = this.gardenOrder.landInfo.landName;
        },
        ...mapActions([
          'clearLandOrder'
        ]),
        buyFinish (isDone) {
          if (isDone) {
            this.clearLandOrder({});
            this.$router.push({
              path: '/purchaseCompletion',
              query: {
                totalPrice: this.total.totalCost
              }
            });
          } else {
            this.clearLandOrder({});
            this.$router.push({
              path: '/orderList'
            });
            this.$toast('未完成付款')
          }
        },
        getPreAccounting (order, type) {
          axios.post(api.order.getPreAccounting, {...order}).then(res => {
            if (type === 'total') {
              this.orderData.totalCost = res.data.data.totalCost
            }
            this[type] = {
              discountRate: res.data.data.discountRate,
              totalCost: res.data.data.totalCost
            };
          }).catch(err => {
            console.log(err);
          })
        },
        nextStep () {
          // 提交订单
          if (window.app.buyNow) {
            axios.post(api.order.submitLandOrder, this.orderData).then(res => {
              let orderData = {
                orderId: res.data.data.orderId,
                totalCost: this.orderData.totalCost
              };
              try {
                window.app.buyNow(JSON.stringify(orderData))
              } catch (e) {
                this.$toast('提交失败')
              }
            });
          } else {
            this.$toast('Native错误')
          }
        },
        goBack () {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  #total {
    p {
      text-align: right;
      padding-left: 10vw;
      .iconRmb {
        font-size: 3vw;
      }
      .totalLabel {
        font-size: 3.8vw;
        font-weight: 600;
      }
      .totalPrice {
        color: #F12020;
        font-size: 5vw;
        font-weight: 600;
      }
      .originalCost {
        font-size: 4vw;
        color: #B4B4B4;
        text-decoration: line-through;
        margin-left: 3vw;
        vertical-align: top;
      }
    }
  }
  .discountRateName {
    text-align: left;
  }
  .discountRateVal {
    text-align: right;
    display: inline-block;
    width: 16vw;
  }
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
