<template>
    <div style="height: 100vh; background: #fff;">
      <van-nav-bar
        title="订单"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-cell-group>
        <van-field
          v-model="orderData.peopleNum"
          type="number"
          required
          clearable
          label="就餐人数"
          placeholder="请输入就餐人数"
          input-align="right"
        />
        <van-field
          v-model="orderData.dinerTime"
          required
          clearable
          readonly
          @focus="chooseDate"
          input-align="right"
          label="开始时间"
          placeholder="请选择开始时间"
        />
      </van-cell-group>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">确认</div>
      </div>
      <van-popup v-model="dateShow" position="bottom" :overlay="true" click-overlay="cancelDate">
        <van-datetime-picker
          v-model="dateTime"
          type="datetime"
          :formatter="dateFormatter"
          title="就餐时间"
          @confirm="handleDate"
          @cancel="cancelDate"
        />
      </van-popup>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex';
  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import Function from '@/util/function'

  export default {
      name: "foodBill",
      data() {
        return {
          dateShow: false,
          dateTime: new Date(),
          keyboardMode: '',
          orderData: {
            contactName: '',
            diners: '',
            dinerTime: '',
            telephone: '',
            total: '',
            foodList: []
          }
        }
      },
      computed: {
        ...mapState(['foodOrder', 'foodCar']),
        dinerTime () {
          return
        }
      },
      mounted () {

      },
      methods: {
        handleDate (value) {
          let tomorrowd = new Date().setDate(new Date().getDate()+1);
          if (new Date(value.toLocaleDateString()).getTime() < tomorrowd) {
            this.$toast('至少选择一天后作为就餐时间')
          } else {
            this.orderData.dinerTime = Function.dateFormat(new Date(value).getTime(), 'YYYY年MM月DD日H:M');
            this.dateShow = false;
          }
        },
        cancelDate () {
          this.dateShow = false
        },
        chooseDate () {
          this.dateShow = true
        },
        dateFormatter(type, value) {
          if (type === 'year') {
            return `${value}年`;
          } else if (type === 'month') {
            return `${value}月`
          }
          return value;
        },
        nextStep () {
          // 提交订单
          try {
            window.app.buyNow(JSON.stringify(this.orderData))
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
