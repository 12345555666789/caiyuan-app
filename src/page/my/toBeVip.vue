<template>
  <div style="height: 100vh; width: 100vw; background-color: #fff">
    <van-nav-bar
      title="成为会员"
      fixed
      left-arrow
      @click-left="goApp"></van-nav-bar>
    <div style="height: 12vw"></div>
    <div class="vipBanner"></div>
    <p style="padding: 2vw 3vw;
    font-size: 4.5vw;
    font-weight: 600;
    color: #193757;">VIP会员说明</p>
    <p style="color: rgb(25, 55, 87);
    padding: 0 3vw;
    font-size: 4vw;
    line-height: 6vw;
    margin-bottom: 15vw;">支付{{Number(config['dim_common_config'].find(item => item.code === "vip_register_fee").name)}}元注册费成为VIP会员，VIP会员发展3个新的VIP会员可以获得60元推荐奖励，并成为三星VIP会员；发展6个新的VIP会员可获得120元推荐奖励，并成为四星VIP会员；发展9个新的VIP会员，可获得180元推荐奖励，并成为五星VIP会员；发展N个(N>5)以上VIP会员，可获得25N元推荐奖励,当发展的VIP会员人数超过20人时将成为钻石会员。 VIP会员享受购地及其他消费服务9.5折优惠。三星VIP会员享受9折优惠，四星VIP会员享受8.5折优惠，五星VIP会员享受8折优惠，钻石会员享受7折优惠。</p>
    <div class="vipBtn" @click="toBeVip">成为会员</div>
  </div>
  </template>

<script>
  import {mapState } from 'vuex';

  export default {
    name: "toBeVip",
    computed: {
      ...mapState(['config']),
    },
    mounted () {
      window['buyFinish'] = (isDone) => {
        this.buyFinish(isDone)
      }
    },
    methods: {
      buyFinish (isDone) {
        if (Number(isDone) === 1) {
          this.$router.push({
            path: '/purchaseCompletion',
            query: {
              totalPrice: this.config['dim_common_config'].find(item => item.code === "vip_register_fee").name,
              from: 'VIP'
            }
          });
        } else {
          this.$toast('未完成付款');
        }
      },
      toBeVip () {
        if (window.app.toBeVip) {
          let totalCost = this.config['dim_common_config'].find(item => item.code === "vip_register_fee").name;
          window.app.toBeVip(JSON.stringify({totalCost}))
        } else {
          this.$toast('Native错误')
        }
      },
      goApp () {
        if (window.app.goBackApp) {
          window.app.goBackApp();
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .vipBtn {
    color: #fff;
    background: #EFB41B;
    border: 1px solid #DD8306;
    width: 90vw;
    margin: 0 auto;
    text-align: center;
    padding: 2vw 4vw;
    font-size: 4vw;
    border-radius: 9vw;
    margin-top: 6vw;
  }
  .vipBanner {
    background: url("../../assets/image/vipBanner.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 33vw;
    margin-bottom: 10vw;
  }

</style>
