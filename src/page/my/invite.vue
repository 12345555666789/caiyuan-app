<template>
  <div style="height: 100vh; width: 100vw;background-color: #F8F7ED;">
    <van-nav-bar
      title="邀请好友"
      @click-left="goApp"
      left-arrow></van-nav-bar>
    <div style="color: #CA7600;">
      <div class="banner"></div>
      <p style="text-align: center;font-size: 4vw;font-weight: 600;margin-bottom: 4vw">我的邀请码</p>
      <div class="codeBox">
        <input id="codeTxt" value="adafadsfas" readonly/>
      </div>
      <div class="copyBtn" ref="copyBtn"><span style="color: #fff">复制邀请码给好友</span></div>
      <p class="readName"><span class="dot"></span><span>邀请码说明</span></p>
      <p class="ruleContent">支付50元注册费成为VIP会员，VIP会员发展3个新的VIP会员可以获得60元推荐奖励，并成为三星VIP会员；发展6个新的VIP会员可获得120元推荐奖励，并成为四星VIP会员；发展9个新的VIP会员，可获得180元推荐奖励，并成为五星VIP会员；发展N个(N>5)以上VIP会员，可获得25N元推荐奖励,当发展的VIP会员人数超过20人时将成为钻石会员。 VIP会员享受购地及其他消费服务9.5折优惠。三星VIP会员享受9折优惠，四星VIP会员享受8.5折优惠，五星VIP会员享受8折优惠，钻石会员享受7折优惠。</p>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'vant';
  export default {
      name: "invite",
      mounted () {
        this.$refs.copyBtn.addEventListener('click', function() {
          if(!document.execCommand) {
            Toast('您的浏览器不支持此复制操作，请手动长按复制');
            return;
          }
          codeTxt.select();
          let result = document.execCommand('copy');
          if(result) {
            Toast('复制成功')
          } else {
            Toast('您的浏览器不支持此复制操作，请手动长按复制')
          }
        }).bind(this);
      },
      methods: {
        goApp () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        },
      }
    }
</script>

<style scoped lang="less">
  .readName {
    font-size: 4vw;
    font-weight: 600;
    padding-left: 2vw;
    margin-bottom: 2vw;
    .dot {
      width: 1vw;
      height: 1vw;
      background: #CA7600;
      display: inline-block;
      vertical-align: middle;
      margin-right: 2vw;
    }
  }
  .ruleContent {
    padding: 0 5vw;
    font-size: 3.5vw;
    font-weight: 600;
    line-height: 5.5vw;
  }
  #codeTxt {
    color: #CA7600;
    min-width: 15vw;
    max-width: 50vw;
    display: block;
    text-align: center;
    background: #fff;
    margin: 0 auto;
    padding: 3vw 6vw;
    border: 1px solid #E4D56A;
    border-radius: 5px;
    font-size: 4vw;
    font-weight: 600;
    margin-bottom: 8vw;
  }
  .banner {
    background: url("../../assets/image/inviteBanner.png") no-repeat;
    background-size: 100% 100%;
    width: 100vw;
    height: 27vw;
    margin-bottom: 5vw;
  }
  .copyBtn {
    background: #EFB41B;
    border: 1px solid #DD8306;
    width: 75vw;
    margin: 0 auto;
    text-align: center;
    padding: 2vw 4vw;
    font-size: 4vw;
    border-radius: 9vw;
    margin-bottom: 20vw;
  }
</style>
