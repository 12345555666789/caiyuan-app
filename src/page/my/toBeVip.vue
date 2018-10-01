<template>
  <van-nav-bar
    title="成为会员"
    left-arrow
    @click-left="goApp"
    @click-left=""></van-nav-bar>
</template>

<script>
    export default {
      name: "toBeVip",
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
