<template>
  <div style="height: 100vw; width: 100vw">
    <van-nav-bar
      title="直播"
      @click-left="goApp"
      left-arrow></van-nav-bar>
  </div>
</template>

<script>
    export default {
      name: "liveTelecast",
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
