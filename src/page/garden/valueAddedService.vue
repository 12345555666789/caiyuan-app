<template>
    <div>
      <van-nav-bar
        title="增值服务"
        fixed
        left-arrow
        @click-left="goBack"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-cell-group>
        <van-cell title="播种方式" is-link arrow-direction="down" :value="sowingMode" @click="chooseMod('sowingMode')" />
        <van-cell title="养护方式" is-link arrow-direction="down" :value="careMode" @click="chooseMod('careMode')"/>
      </van-cell-group>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">生成订单</div>
      </div>
      <van-popup v-model="show" position="bottom">
        <van-picker
          show-toolbar
          :title="title"
          :columns="columns"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  export default {
      name: "valueAddedService",
      data() {
        return {
          title: '',
          show: false,
          columns: ['托管', '自理'],
          mode: '',
          sowingMode: '托管',
          careMode: '托管'
        }
      },
      computed: {
        ...mapState(['gardenOrder']),
      },
      mounted () {
        this.sowingMode = this.gardenOrder.sowingMode || '';
        this.careMode = this.gardenOrder.careMode || '';
      },
      methods: {
        nextStep () {
          this.$router.push({
            path: '/landBill',
          })
        },
        chooseMod (mod) {
          this.show = true;
          this.mode = mod
        },
        onConfirm(value) {
          if (this.mode === 'sowingMode') {
            this.sowingMode = value;
            this.$store.commit('setSowingMode', value)

          } else {
            this.careMode = value;
            this.$store.commit('setCareMode', value)
          }
          this.show = false;
        },
        goBack () {
          window.history.back()
        },
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
