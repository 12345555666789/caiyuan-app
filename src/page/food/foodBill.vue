<template>
    <div style="height: 100vh; background: #fff;">
      <van-nav-bar
        title="订单详情"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-cell-group>

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
      name: "foodBill",
      data() {
        return {
          oderData: {
            lands: [],
            endDate: '',
            startDate: '',
            fertilizers: [],
            seeds: [],
            recMod: 1,
            sowingMode: 1,
            careMode: 1
          },
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
              lands[item.landSpec] = {landSpec: item.landSpec, count: 1, landId: item.landId}
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
        window['buyFinish'] = (isDone) => {
          this.buyFinish(isDone)
        };
        this.gardenOrder.landInfo.lands.forEach(item => {
          this.oderData.lands.push(item.landId + "")
        });
        this.oderData.startDate = this.gardenOrder.landInfo.startDate;
        this.oderData.endDate = this.gardenOrder.landInfo.endDate;
        Object.values(this.setCar.fertilizer).forEach(item => {
          this.oderData.fertilizers.push({
            count: item.num,
            fertilizerId: item.fertId
          })
        });
        Object.values(this.setCar.seed).forEach(item => {
          this.oderData.seeds.push({
            count: item.num,
            seedId: item.seedId
          })
        });
        this.oderData.careMode = this.gardenOrder.careMode === '托管' ? 1 : 2;
        this.oderData.sowingMode = this.gardenOrder.sowingMode === '托管' ? 1 : 2;
        this.recMod = this.gardenOrder.recMod === '托管' ? 1 : 2;

        this.getPreAccounting({lands: this.oderData.lands}, 'landDiscount');
        this.getPreAccounting({
          startDate: this.oderData.startDate,
          endDate: this.oderData.endDate
        }, 'dateDiscount');
        this.getPreAccounting({}, 'vipDiscount');
        this.getPreAccounting(this.oderData, 'total');
      },
      methods: {
        ...mapActions([
          'clearLandOrder'
        ]),
        buyFinish (isDone) {
          if (isDone) {
            this.clearLandOrder({});
            this.$router.push({
              path: '/gardenList',
            });
            window.location.reload()
          } else {
            this.$toast('提交失败')
          }
        },
        getPreAccounting (order, type) {
          axios.post(api.order.getPreAccounting, {...order}).then(res => {
            return res.data.data
          }).catch(() => {
            this[type] = {
              discountRate: Math.round(Math.random()*10),
              totalCost: Math.round(Math.random()*1000)
            }
          })
        },
        nextStep () {
          // 提交订单
          try {
            window.app.buyNow(JSON.stringify(this.oderData))
          } catch (e) {
            this.$toast('提交失败')
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
      padding-left: 30vw;
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
