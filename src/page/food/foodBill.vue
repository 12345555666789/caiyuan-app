<template>
    <div style="height: 100vh; background: #fff;">
      <van-nav-bar
        title="订单"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 11vw"></div>
      <van-cell-group>
        <van-field
          v-model="orderData.peopleNum"
          type="number"
          clearable
          label="就餐人数"
          placeholder="请输入就餐人数"
          input-align="right"
        />
        <van-field
          v-model="orderData.dinerTime"
          clearable
          readonly
          @focus="chooseDate"
          input-align="right"
          label="就餐时间"
          placeholder="请选择就餐时间"
        />
        <van-field
          v-model="orderData.contactName"
          type="text"
          clearable
          label="联系人"
          placeholder="请输入联系人"
          input-align="right"
        />
        <van-field
          v-model="orderData.telephone"
          type="number"
          clearable
          label="联系电话"
          placeholder="请输入联系电话"
          input-align="right"
        />
      </van-cell-group>
      <div class="totalCast">总计预算: <span class="total"><span class="iconRmb">¥</span>{{orderData.total}}</span></div>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">完成</div>
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
      },
      mounted () {
        this.orderData.total = this.foodOrder.total
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
          } else if (type === 'day') {
            return `${value}日`
          } else if (type === 'hour') {
            return `${value}时`
          } else if (type === 'minute') {
            return `${value}分`
          }
          return value;
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
  .totalCast {
    margin-top: 4vw;
    text-align: center;
    .total {
      color: #F12020;
      font-size: 4vw;
      font-weight: 600;
      .iconRmb {
        font-size: 3vw;
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
