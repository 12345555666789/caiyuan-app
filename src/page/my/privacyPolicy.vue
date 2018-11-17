<template>
    <div style="height: 100vh; width: 100vw;background-color: #fff">
      <van-nav-bar
        title="隐私政策"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-cell-group>

      </van-cell-group>
    </div>
</template>

<script>
    export default {
      name: "privacyPolicy",
      methods: {
        onClickLeft () {
          if (window.app.goBackApp) {
            window.app.goBackApp()
          }
        },
      }
    }
</script>

<style scoped lang="less">

</style>
