<template>
    <div style="height: 100vh; width: 100vw; background: #fff;">
      <van-nav-bar
        title="订单"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 11vw"></div>
      <van-cell-group>
        <van-field
          v-model="orderData.diners"
          type="number"
          clearable
          label="就餐人数"
          placeholder="请输入就餐人数"
          input-align="right"
        />
        <van-field
          v-model="this.orderData.dinerTime"
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
        ...mapState(['foodOrder', 'foodCar'])
      },
      mounted () {
        this.initPage()
      },
      activated () {
        this.initPage()
      },
      methods: {
        ...mapMutations(['clearFoodCar']),
        initPage () {
          this.orderData.foodList = [];
          this.orderData.total = this.foodOrder.total;
          Object.values(this.foodCar).forEach(item => {
            this.orderData.foodList.push({
              foodId: item.foodId,
              count: item.num
            })
          })
        },
        handleDate (value) {
          if (new Date(value.toLocaleDateString()).getDate() < new Date().getDate() + 1) {
            this.$toast('至少选择一天后作为就餐时间')
          } else {
            this.orderData.dinerTime = Function.dateFormat(new Date(value).getTime(), 'YYYY/MM/DD H:M');
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
        checkForm () {
          let dinersReg = /^[1-9]\d*$/;
          let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          let nameReg =  /^[\u4E00-\u9FA5A-Za-z]+$/;
          if (!this.orderData.diners || !dinersReg.test(this.orderData.diners)) {
            this.$toast('请输入就餐人数');
            return false
          } else if (this.orderData.diners > 100) {
            this.$toast('就餐人数最多100人');
            return false
          } else if (!this.orderData.dinerTime) {
            this.$toast('请选择就餐时间');
            return false
          } else if (!this.orderData.contactName || !nameReg.test(this.orderData.contactName)) {
            this.$toast('请输入中文或英文的联系人名字');
            return false
          } else if (!this.orderData.telephone || !phoneReg.test(this.orderData.telephone)) {
            this.$toast('请输入手机号码格式的联系电话');
            return false
          } else if (!this.orderData.foodList.length) {
            this.$toast('您尚未选择食材，请先返回选择');
            return false
          } else if (!this.orderData.total) {
            this.$toast('系统结算失败，请退出并重试');
            return false
          } else {
            return true
          }
        },
        nextStep () {
          // 提交订单
          if (this.checkForm()) {
            axios.post(api.order.submitFoodOrder, this.orderData).then(res => {
              this.clearFoodCar();
              this.$toast('提交成功');
              this.$router.push({
                path: '/orderList',
                query: {
                  mod: 'food',
                  fromH5: true
                }
              })
            }).catch(() => {
              this.$toast('提交失败请重试')
            })
          }
        },
        goBack () {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  .totalCast {
    margin-top: 7vw;
    text-align: center;
    .total {
      color: #F12020;
      font-size: 4.5vw;
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
