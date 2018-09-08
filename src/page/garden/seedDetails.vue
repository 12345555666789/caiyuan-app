<template>
  <div>
    <van-nav-bar
      title="种子详情"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getSeedInfo">
      <van-swipe style="height: 80vw">
        <van-swipe-item v-for="(item, index) in seedInfo.seedPics">
          <img :src="item" height="100%" width="100%">
        </van-swipe-item>
      </van-swipe>
      <div class="seedInfo">
        <p class="price">
          <span>¥</span><b>{{seedInfo.price}}</b>
        </p>
        <p class="seedName"><b>{{seedInfo.seedName}}</b>
          <span>{{seedInfo.season}}</span>
        </p>
        <p class="seedDesc">说明:
          {{seedInfo.seedDesc}}
        </p>
        <div class="seedSpec">
          <span>规格</span>
          <div>{{seedInfo.seedSpec}}</div>
        </div>

      </div>
    </van-pull-refresh>
    <div class="van-goods-action">
      <div class="carBtn"><span class="iconCar"><span class="totalNum" v-show="totalNum()">{{totalNum()}}</span></span></div>
      <div class="footerBtn entrustBtn" @click="addCar">加入菜篮</div>
    </div>
  </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import Function from '@/util/function'

  export default {
    name: "seedDetails",
    data() {
      return {
        carList: null,
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        videoShow: false,
        isLoading: false,
        seedId: this.$route.query.seedId,
        seedInfo: {
          seedId: 'as1321',
          seedName: '西瓜',
          seedType: 2,
          seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
          seedSpec: '每袋500g',
          price: 500.33,
          seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
          season: '全季',
          stock: 999
        }
      }
    },
    computed: {
      ...mapGetters(['gardenOrder']),
    },
    mounted () {
      this.getSeedInfo();
      this.gardenOrder.car ? this.carList = this.gardenOrder.car : null;

    },
    methods: {
      ...mapMutations([
        'addToLandCar', 'reduceToCar'
      ]),
       totalNum () {
        let totalNum = 0;
        if (this.gardenOrder.car) {
          for (let item in this.gardenOrder.car) {
            totalNum += this.gardenOrder.car[item].num
          }
          return totalNum
        }
      },
      addCar () {
        this.addToLandCar(this.seedInfo);
        this.carList = this.gardenOrder.car;
      },
      onClickLeft() {
        window.history.back()
      },
      getSeedInfo() {
        axios.get(api.common.getInfo + this.seedId, {
          params: {
            objType: constant.infoType.land
          }
        }).then((res) => {
          this.seedInfo = res.data.data;
          this.page = 0;
          this.getComments();
          this.isLoading = false
        }).catch((err) => {
          this.isLoading = false
        })
      },
      landRegion() {
        this.$router.push({
          path: '/landRegionList'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .iconCar {
    position: relative;
    .totalNum {
      position: absolute;
      top: -1vw;
      right: -2vw;
      font-size: 3vw;
      color: #fff;
      display: inline-block;
      border-radius: 10vw;
      background-color: #DE3B3B;
      padding: 0.5vw 0.3vw;
      text-align: center;
    }
  }
  .carBtn {
    padding-right: 3vw;
    border-right: 1px solid #DFDFDF;
    margin-right: 4vw;
    height: 7vw;
    margin-top: 1.5vw;
  }
  .seedInfo {
    padding: 5vw 3vw;
    .price {
      color: #F12020;
      font-size: 5vw;
      margin-bottom: 2vw;
      span {
        font-size: 3.5vw;
        margin-right: 1vw;
      }
    }
    .seedName {
      font-size: 4vw;
      margin-bottom: 2vw;
      span {
        margin-left: 1vw;
        padding: 0.5vw 2vw;
        font-size: 2.5vw;
        border-radius: 10vw;
        background-color: #FFE7E7;
        color: #F12020;
        display: inline-block;
        vertical-align: text-top;
      }
    }
    .seedDesc {
      color: #505050;
      font-size: 3.5vw;
      padding-bottom: 2vw;
      margin-bottom: 2vw;
      border-bottom: 1px solid #E1E1E1;
    }
    .seedSpec {
      color: #A1A1A1;
      font-size: 3vw;
      div {
        display: inline-block;
        font-size: 3vw;
        padding: 1vw 2.6vw;
        background-color: #E1F6F5;
        border: 1px solid #32A9A1;
        border-radius: 10vw;
        color: #32A9A1;
        margin-left: 3vw;
      }
    }
  }
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
