<template>
  <div style="height: 100vh; width: 100vw; background-color: #fff">
    <van-nav-bar
      title="交易详情"
      fixed>
    </van-nav-bar>
    <p class="buyDone">
      <van-icon name="checked"/>
    </p>
    <p class="purchaseCompletion"><span>支付成功</span></p>
    <p class="totalPrice"><span class="iconRmb">¥</span><span>{{formatMoney(totalPrice)}}</span></p>
    <p class="doneBtn" @click="backOrderList"><span>完成</span></p>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    name: "purchaseCompletion",
    data() {
      return {
        totalPrice: this.$route.query.totalPrice
      }
    },
    mounted () {
      if (window.app.lastPage) {
        window.app.lastPage()
      }
    },
    methods: {
      ...mapActions([
        'clearLandOrder'
      ]),
      backOrderList() {
        if (this.$route.query.from && this.$route.query.from === 'VIP') {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        } else {
          this.clearLandOrder({});
          this.$router.push({
            path: '/gardenList'
          });
        }
      },
      formatMoney(s, type) {
        if (/[^0-9\.]/.test(s))
          return "0";
        if (s == null || s == "")
          return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
          s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        if (type == 0) {// 不带小数位(默认是有小数位)
          var a = s.split(".");
          if (a[1] == "00") {
            s = a[0];
          }
        }
        return s;
      }

    }
  }
</script>

<style scoped lang="less">
  .buyDone {
    padding-top: 25vw;
    font-size: 25vw;
    text-align: center;
    color: #2ba33b;
  }

  .purchaseCompletion {
    font-size: 7vw;
    text-align: center;
  }

  .totalPrice {
    text-align: center;
    margin-top: 3vw;
    font-size: 12vw;
    font-weight: 400;
  }

  .doneBtn {
    text-align: center;
    margin-top: 17vw;
    span {
      display: inline-block;
      width: 90vw;
      height: 13vw;
      line-height: 13vw;
      font-size: 5vw;
      border-radius: 4px;
      color: #fff;
      background-color: #2ba33b;
    }
  }
</style>
