<template>
  <van-nav-bar
    title="发表评价"
    left-arrow
    @click-left="goBack"></van-nav-bar>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import constant from '@/config/constant';
  import Function from '@/util/function';
    export default {
      name: "evaluationFood",
      data () {
        return {
          orderId: this.$route.query.orderId
        }
      },
      mounted () {

      },
      methods: {
        getFoods () {
          axios.post(api.my.orderFoodList + this.orderId).then(() => {

          })
        },
        goBack () {
          window.history.back()
        },
      }
    }
</script>

<style scoped>

</style>
