<template>
    <div>
      <van-nav-bar
        title="发布圈子"
        fixed
        left-arrow
        @click-left="goApp"></van-nav-bar>
      <div style="height: 14vw"></div>
      <van-uploader :after-read="onRead" accept="image/gif, image/jpeg" multiple>
        <van-icon name="photograph" />
      </van-uploader>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">完成</div>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  export default {
      name: "momentPublish",
      data() {
        return {
        }
      },
      computed: {
      },
      mounted () {
      },
      activated () {
      },
      methods: {

        nextStep () {

        },
        goApp () {
          if (window.app) {
            window.app.go2MainPage();
          }
        }
      }
    }
</script>

<style scoped lang="less">
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
