<template>
  <div style="height: 100vh; width: 100vw">
    <van-nav-bar
      title="我的订单"
      left-arrow
      @click-left="goApp"></van-nav-bar>
    <van-tabs v-model="active" swipeable sticky>
      <van-tab title="已购菜园">
        <van-pull-refresh v-model="orderIsLoading" @refresh="onRefreshorder">
          <div class="landOrder" v-if="landOrderList.length">
            <div class="orderItem" v-for="item in landOrderList">
              <van-cell-group>
                <van-cell>
                  <div class="orderTitle">
                    <div class="orderDate">{{createDate(item.createDate)}}</div>
                    <div class="orderState">{{orderState(item.orderStatus) && orderState(item.orderStatus).name}}
                      <span v-if="![11, 40].includes(item.orderStatus)">&nbsp | &nbsp</span>
                      <span class="deleteOrder" v-if="![11, 40].includes(item.orderStatus)"
                            @click="deleteOrder(item, 1)"></span>
                    </div>
                  </div>
                </van-cell>
                <van-cell title="菜园名称">
                  <div class="value">{{item.landName}}</div>
                </van-cell>
                <van-cell title="规格">
                  <div class="value" v-for="size in item.landSizes">{{size.replace('x', ' × ')}}</div>
                </van-cell>
                <van-cell title="租赁时间">
                  <div class="value">{{commentDate(item.createDate)}}-{{commentDate(item.endDate)}}</div>
                </van-cell>
                <van-cell title="开垦模式">
                  <div class="value">{{item.recMode === 1 ? '托管' : '自理'}}</div>
                </van-cell>
                <van-cell title="肥料套餐">
                  <div class="value" v-for="fertilizer in item.fertilizers">{{fertilizer.replace('x', ' × ')}}</div>
                </van-cell>
                <van-cell title="作物种子">
                  <div class="value" v-for="seed in item.seeds">{{seed.replace('x', ' × ')}}</div>
                </van-cell>
                <van-cell>
                  <div class="value" style="text-align: right">
                    <span>{{item.orderStatus === 10 ? '应付总额' : '交易总额'}}: </span><span class="totalPrice"><span
                    class="iconRmb">¥</span>{{item.totalAmount}}</span></div>
                </van-cell>
                <van-cell>
                  <div class="value" style="text-align: right">
                    <span class="orderBtn" v-if="[20, 30, 41].includes(item.orderStatus)"
                          @click="toChooseLand">再次购买</span>
                    <span class="orderBtn" v-if="[20].includes(item.orderStatus) && checkDate(item.createDate)" @click="showRefund(item.orderId)">退款</span>
                    <span class="orderBtn" v-if="[10].includes(item.orderStatus)" @click="cancelOrder(item, 1)">取消</span>
                    <span class="orderBtn" v-if="item.orderStatus === 10" @click="toPay">去付款</span>
                  </div>
                </van-cell>
              </van-cell-group>
            </div>
            <div class="noDataList"><span>已经到底啦~</span></div>
          </div>
          <div class="carNoData" v-else>暂无数据</div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="美食预约">
        <van-pull-refresh v-model="orderIsLoading" @refresh="onRefreshorder">
          <div class="landOrder" v-if="foodOrderList.length">
            <div class="orderItem" v-for="item in foodOrderList">
              <van-cell-group>
                <van-cell>
                  <div class="orderTitle">
                    <div class="orderDate">{{createDate(item.createDate)}}</div>
                    <div class="orderState">{{orderState(item.orderStatus) && orderState(item.orderStatus).name}}
                      <span v-if="![11, 40].includes(item.orderStatus)">&nbsp | &nbsp</span>
                      <span class="deleteOrder" v-if="![11, 40].includes(item.orderStatus)"
                            @click="deleteOrder(item, 0)"></span>
                    </div>
                  </div>
                </van-cell>
                <van-cell title="菜品">
                  <div class="value" v-for="food in item.foods">{{food.replace('x', ' × ')}}</div>
                </van-cell>
                <van-cell title="就餐时间">
                  <div class="value">{{dinerTime(item.dinerTime)}}</div>
                </van-cell>
                <van-cell title="就餐人数">
                  <div class="value">{{item.diners}}人</div>
                </van-cell>
                <van-cell title="联系人">
                  <div class="value">{{item.contactName }}</div>
                </van-cell>
                <van-cell title="联系电话">
                  <div class="value">{{item.telephone }}</div>
                </van-cell>
                <van-cell title="预算金额">
                  <div class="value"><span class="totalPrice"><span class="iconRmb">¥</span>{{item.total}}</span></div>
                </van-cell>
                <van-cell>
                  <div class="value" style="text-align: right">
                    <span class="orderBtn" @click="toChooseFood">再次预约</span>
                    <span class="orderBtn" v-if="[10].includes(item.orderStatus)" @click="cancelOrder(item, 0)">取消</span>
                    <span class="orderBtn" @click="toEvaluation(item.orderId)">评价</span>
                  </div>
                </van-cell>
              </van-cell-group>
            </div>
            <div class="noDataList"><span>已经到底啦~</span></div>
          </div>
          <div class="carNoData" v-else>暂无数据</div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-dialog
      v-model="refundState"
      show-cancel-button
      :before-close="refund">
      <van-radio-group v-model="reason">
        <van-cell-group>
          <van-cell title="选错了/不想买了" clickable>
            <van-radio name="选错了/不想买了" />
          </van-cell>
          <van-cell title="土地已被租或商品缺货" clickable>
            <van-radio name="土地已被租或商品缺货" />
          </van-cell>
          <van-cell title="其他" clickable>
            <van-radio name="其他" />
          </van-cell>
          <van-field
            v-if="reason === '其他'"
            v-model="reason"
            type="text"
            label="其他"
            placeholder="其他原因"
          />
        </van-cell-group>
      </van-radio-group>

    </van-dialog>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import constant from '@/config/constant';
  import Function from '@/util/function';

  export default {
    name: "orderList",
    data() {
      return {
        refundId: '',
        refundState: false,
        reason: '',
        orderLoading: false,
        orderIsLoading: false,
        active: 0,
        foodOrderList: [],
        landOrderList: [],
        mod: this.$route.query.mod
      }
    },
    mounted() {
      this.getOrderList();
      if (this.mod) {
        if (this.mod === 'food') {
          this.active = 1
        }
      }
    },
    methods: {
      get7Days(dateTime) {
        let date = dateTime || new Date(),
          timestamp, newDate;
        if (!(date instanceof Date)) {
          date = new Date(date.replace(/-/g, '/'));
        }
        timestamp = date.getTime();
        newDate = new Date(timestamp + 7 * 24 * 3600 * 1000);
        return [
          [
            newDate.getFullYear(),
            newDate.getMonth() + 1,
            newDate.getDate()].join('/'),
          [
            newDate.getHours(),
            newDate.getMinutes(),
            newDate.getSeconds()].join(':')
        ].join(' ');
      },
      checkDate(data) {
        let orderDate = new Date(this.get7Days(new Date(data))).getTime();
        let today = new Date().getTime();
        return orderDate < today;
      },
      toEvaluation(orderId) {
        this.$router.push({
          path: '/evaluationFood',
          query: {
            orderId
          }
        })
      },
      showRefund (id) {
        this.refundState = true;
        this.refundId = id
      },
      refund () {
        if (this.reason) {
          axios.post(api.my.refund, {
            reason: this.reason,
            orderId: this.refundId
          }).then(() => {
            this.refundState = false;
            this.$toast('已提交退款申请');
            this.getOrderList();
          })
        } else {
          this.$toast('请选择退款原因')
        }
      },
      deleteOrder(data, type) {
        let massage = type ? '菜园' : '美食';
        if (data) {
          this.$dialog.confirm({
            title: '提示',
            message: '确认要删除该' + massage + '订单吗'
          }).then(() => {
            // on confirm
            axios.post(api.my.deleteOrder + data.orderId).then(() => {
              this.$toast('订单已删除');
              this.getOrderList();
            })
          }).catch(() => {
            // on cancel
          });
        }
      },
      cancelOrder(data, type) {
        let massage = type ? '菜园' : '美食';
        if (data) {
          this.$dialog.confirm({
            title: '提示',
            message: '确认要取消该' + massage + '订单吗'
          }).then(() => {
            // on confirm
            axios.post(api.my.cancelOrder + data.orderId).then(() => {
              this.$toast('订单已取消');
              this.getOrderList();
            })
          }).catch(() => {
            // on cancel
          });
        }
      },
      toChooseFood() {
        this.$router.push({
          path: '/makeFood'
        })
      },
      toPay() {
        // TODO 付款逻辑
        this.$toast('去付款');
      },
      toChooseLand() {
        this.$router.push({
          path: '/landRegionList'
        })
      },
      orderState(state) {
        return constant.orderStates.find(item => item.code === state)
      },
      createDate(date) {
        return Function.dateFormat(date, 'YYYY-MM-DD')
      },
      commentDate(date) {
        return Function.dateFormat(date, 'YYYY/MM/DD')
      },
      dinerTime(date) {
        return Function.dateFormat(date, 'YYYY-MM-DD  H:M')
      },
      onRefreshorder() {
        this.getOrderList();
      },
      goApp() {
        if (window.app.goBackApp()) {
          window.app.goBackApp();
        }
      },
      getOrderList() {
        axios.post(api.my.orderList).then((res) => {
          this.orderIsLoading = false;
          this.orderLoading = false;
          this.landOrderList = res.data.data.landOrderList;
          this.foodOrderList = res.data.data.foodOrderList;
        }).catch((res) => {
          this.orderLoading = false;
          this.orderIsLoading = false;
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .totalPrice {
    color: #F12020;
    font-size: 4.5vw;
    .iconRmb {
      font-size: 3vw;
    }
  }

  .orderBtn {
    border-radius: 7vw;
    color: #38ACA5;
    border: 1px solid #38ACA5;
    padding: 0.5vw 3.5vw;
    display: inline-block;
  }

  .orderItem {
    background-color: #fff;
    .orderTitle {
      font-size: 3.5vw;
      height: 5vw;
      .orderDate {
        color: #ACACAC;
        display: inline-block;
      }
      .orderState {
        display: inline-block;
        color: #38ACA5;
        float: right;
        .deleteOrder {
          display: inline-block;
          width: 4vw;
          height: 4vw;
          vertical-align: sub;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAMAAAC7faEHAAAAXVBMVEUAAAA4rKY4raY3raU2qac4rac4sK04rKQ4rKU2rqc4rKU3rKU5raY4raU3rKU4raY4rqg4rqY3raU4raY3raU3raY3rqY4rKU4raU4raY4rKY4raU5r6U4rKU4rKVuKjrSAAAAHnRSTlMATXY+CH8Nv+Qv7a+YxPPSJx3dbqVFE/jJXIpmUbOhLoasAAAA8klEQVQ4y+2USXbDIBBE2xJCg82MZrvuf8w8PWIFEmQre/9d0Z9uFgDF8FlIBOS0cjqA+xE/jP5IXAEoEZhGwB14NcZ5D5cRKq8xBWX2NExo4sHGFd9UHZql2JOFrJ7BaVI4gyWBM0xk+st7ekP/g7FTBVM/8p0HL+KCA/qs1wJFFAvgEvZrFsbpgTZKoMp4/GHD9tnWwwuvbXDlW7sbuvLjfbw3nrbwbPMWdO0Lj9y1DPfYF3TopeQ8B9yzXp++jzuwRjEpzFE0QM1z3g3Q6dcHP/zVZglBMdoCcqpTxLbY/zqwQo7GMUrRi5JIkWrRT+0LiqItFM156mQAAAAASUVORK5CYII=") no-repeat;
          background-size: 100% 100%;
          position: relative;
        }
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

  .carNoData {
    height: 20vw;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    font-size: 4vw;
    color: #5e5e5e;
  }

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
