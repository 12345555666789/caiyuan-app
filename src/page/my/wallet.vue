<template>
  <div style="height: 100vh; width: 100vw;background: #FCFCFA">
    <van-nav-bar
      title="我的钱包"
      fixed
      @click-left="goApp"
      left-arrow></van-nav-bar>
    <div style="height: 12vw"></div>
    <div class="balanceIcon"></div>
    <div style="color: #503303;">
      <p class="balance"><span class="iconRmb">¥  </span>{{userInfo.balance}}</p>
      <p style="margin: 3vw auto;text-align: center;font-size: 4vw;font-weight: 600;margin-bottom: 15vw;">我的余额</p>
      <p style="font-size: 4vw;
    font-weight: 600;
    padding: 0 4vw;
    margin-bottom: 3vw;">余额说明</p>
    </div>
    <p style="color: #6A470D;
    padding: 0 3vw;
    font-size: 3.8vw;
    line-height: 6.5vw;">支付50元注册费成为VIP会员，VIP会员发展3个新的VIP会员可以获得60元推荐奖励，并成为三星VIP会员；发展6个新的VIP会员可获得120元推荐奖励，并成为四星VIP会员；发展9个新的VIP会员，可获得180元推荐奖励，并成为五星VIP会员；发展N个(N>5)以上VIP会员，可获得25N元推荐奖励,当发展的VIP会员人数超过20人时将成为钻石会员。 VIP会员享受购地及其他消费服务9.5折优惠。三星VIP会员享受9折优惠，四星VIP会员享受8.5折优惠，五星VIP会员享受8折优惠，钻石会员享受7折优惠。</p>
    <div class="walletBtn" @click="$router.push({path: '/invite'})">邀请好友</div>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapState, mapMutations} from 'vuex'
    export default {
      name: "wallet",
      computed: {
        ...mapState(['userInfo', 'userAction'])
      },
      mounted () {
        this.getUserInfo();
      },
      methods: {
        ...mapMutations(['setUserAction', 'setUserInfo']),
        getUserInfo () {
          axios.post(api.my.userInfo).then(res => {
            this.setUserInfo(res.data.data);
          })
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
  .walletBtn {
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
  .balance {
    text-align: center;
    font-size: 10vw;
    font-weight: 600;
  }
  .balanceIcon {
    background: url("../../assets/image/balance.png") no-repeat;
    background-size: 100% 100%;
    height: 20vw;
    width: 20vw;
    margin: 10vw auto;
    margin-bottom: 4vw;
  }
.iconRmb {
  font-size: 5vw;
}
</style>
