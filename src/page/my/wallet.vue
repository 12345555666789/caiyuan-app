<template>
  <div style="height: 100vw; width: 100vw">
    <van-nav-bar
      title="我的钱包"
      @click-left="goApp"
      left-arrow></van-nav-bar>
  </div>
</template>

<script>
    export default {
      name: "wallet",
      methods: {
        goApp () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        },
      }
    }
</script>

<style scoped>

</style>
