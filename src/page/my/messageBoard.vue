<template>
    <div style="width: 100vw; height: 100vh">
      <van-nav-bar
        title="留言板"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
    </div>
</template>

<script>
    export default {
      name: "messageBoard",
      methods: {
        onClickLeft() {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        },
      }
    }
</script>

<style scoped>

</style>
