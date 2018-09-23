<template>
  <div>
    <van-nav-bar
      title="肥料详情"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getfertilizerInfo">
      <van-swipe style="height: 80vw;width: 100vw;">
        <van-swipe-item v-for="(item, index) in fertilizerInfo.fertPics">
          <img :src="item" height="100%" width="100%">
        </van-swipe-item>
      </van-swipe>
      <div class="fertilizerInfo">
        <p class="price">
          <span>¥</span><b>{{fertilizerInfo.price}}</b>
        </p>
        <p class="fertName"><b>{{fertilizerInfo.fertName}}</b>
          <span>{{fertilizerInfo.season}}</span>
        </p>
        <p class="fertDesc">说明:
          {{fertilizerInfo.fertDesc}}
        </p>
        <div class="fertSpec">
          <span>规格</span>
          <div>{{fertilizerInfo.fertSpec}}</div>
        </div>

      </div>
    </van-pull-refresh>
    <div class="van-goods-action">
      <div class="carBtn" @click="modalShow = true">
        <span class="iconCar"><span class="totalNum" v-show="totalNum()">{{totalNum()}}</span></span></div>
      <div class="footerBtn entrustBtn" @click="addCar(fertilizerInfo)">加入菜篮</div>
    </div>
    <van-actionsheet v-model="modalShow" title="已选种子及肥料">
      <div class="goodsCar" v-if="totalNum()">
        <div class="itemGoods" v-for="item in Object.values(carList)">
          <div>
            <div class="itemGoodsName">{{item['fertName'] || item['seedName']}}</div>
            <div class="addSeed">
              <div class="iconReduce"
                   @click.stop="reduceCar(item)"></div>
              <span class="seedNum">{{carList && ((carList[item.fertId] && carList[item.fertId].num) || (carList[item.seedId] && carList[item.seedId].num))}}</span>
              <van-icon name="add" @click.stop="addCar(item)"/>
            </div>
          </div>
        </div>
      </div>
      <div class="carNoData" v-else>
        <p>菜篮空空如也~</p>
      </div>
    </van-actionsheet>
  </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
  import Function from '@/util/function'

  export default {
    name: "fertilizerDetails",
    data() {
      return {
        modalShow: false,
        carList: {},
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        videoShow: false,
        isLoading: false,
        fertId: this.$route.query.fertId,
        fertilizerInfo: {}
      }
    },
    computed: {
      ...mapState(['gardenCar']),
    },
    mounted () {
      this.getfertilizerInfo();
      this.gardenCar ? this.carList = this.gardenCar : null;
    },
    activated () {
      this.gardenCar ? this.carList = this.gardenCar : null;
    },
    methods: {
      ...mapMutations([
        'addToLandCar', 'reduceLandToCar'
      ]),
       totalNum () {
        let totalNum = 0;
        if (this.gardenCar) {
          for (let item in this.gardenCar) {
            totalNum += this.gardenCar[item].num
          }
          return totalNum
        }
      },
      addCar (data) {
        this.addToLandCar(data);
        this.carList = this.gardenCar;
      },
      reduceCar (data) {
        this.reduceLandToCar(data);
        this.carList = this.gardenCar;
      },
      onClickLeft() {
        window.history.back()
      },
      getfertilizerInfo() {
        axios.post(api.common.getInfo, {
          objType: constant.infoType.fertilizer,
          objId: this.fertId
        }).then((res) => {
          this.fertilizerInfo = res.data.data;
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
  .carNoData {
    height: 20vw;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    font-size: 4vw;
    color: #5e5e5e;
  }
  .itemGoods {
    position: relative;
    height: 15vw;
    display: flex;
    align-items: center;
    padding: 3vw 3vw;
    border-bottom: 1px solid #DFDFDF;
    .itemGoodsName {
      font-size: 4vw;
      font-weight: 600;
    }
  }
  .goodsCar {
    min-height: 50vw;
    max-height: 100vw;
    overflow: auto;
  }
  .iconCar {
    position: relative;
    .totalNum {
      position: absolute;
      top: -1vw;
      right: -2vw;
      font-size: 3vw;
      color: #fff;
      border-radius: 10vw;
      background-color: #DE3B3B;
      padding: 0.4vw 1.3vw;
      min-width: 2vw;
      display: inline-block;
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
  .fertilizerInfo {
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
    .fertName {
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
    .fertDesc {
      color: #505050;
      font-size: 3.5vw;
      padding-bottom: 2vw;
      margin-bottom: 2vw;
      border-bottom: 1px solid #E1E1E1;
    }
    .fertSpec {
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
  .addSeed {
    height: 6vw;
    width: 20vw;
    font-size: 6vw;
    display: flex;
    justify-items: center;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #38ACA5;
    border-radius: 50%;
    position: absolute;
    top: 4vw;
    right: 4vw;
    .seedNum {
      font-size: 3.8vw;
      margin: 0 auto;
      color: #555555;
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
