<template>
    <div style="height: 100vh; width: 100vw;background-color: #fff">
      <van-nav-bar
        title="帮助与客服"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>

    </div>
</template>

<script>
    export default {
      name: "help",
      methods: {
        onClickLeft () {
          if (window.app.goBackApp) {
            window.app.goBackApp()
          }
        },
      }
    }
</script>

<style scoped>

</style>
