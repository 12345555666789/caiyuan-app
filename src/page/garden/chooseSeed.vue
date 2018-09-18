<template>
  <div>
    <van-nav-bar
      :title="Number(recMod) === 0 ? '委托开垦选苗' : Number(recMod) === 1 ? '自主开垦选苗' : '开垦选苗'"
      fixed
      left-arrow
      @click-left="goBack"></van-nav-bar>
    <div style="height: 11vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <form action="/">
        <van-search
          v-model="searchValue"
          placeholder="搜索"
          background="#fff"
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>
      <van-tabbar v-model="active" @change="changeActive" :fixed="false" style="margin-bottom: 1vw;">
        <van-tabbar-item ref="overallSort">综合<van-icon name="arrow" /></van-tabbar-item>
        <van-tabbar-item ref="stockSort">库存<van-icon name="arrow" /></van-tabbar-item>
        <van-tabbar-item ref="priceSort">价格<van-icon name="arrow" /></van-tabbar-item>
      </van-tabbar>
      <van-list
        v-if="seedData.length"
        v-model="loading"
        @load="getSeedList"
        :offset="30"
        :finished="finished">
        <div class="seedItem" v-for="item in seedData" @click="toSeedInfo(item.seedId)">
          <div class="seedPic">
            <img v-lazy="item.seedPics[0]">
          </div>
          <div class="seedInfo">
            <div class="seedName">{{item.seedName}}</div>
            <div class="seedSpec">{{item.seedSpec}}</div>
            <div class="seedPrice"><span>¥</span>{{item.price}}</div>
            <div class="seedSeason">{{item.season}}</div>
            <div class="addSeed" v-if="carList && carList[item.seedId]">
              <div class="iconReduce"
                   @click.stop="reduceCar(item)"></div>
              <span class="seedNum">{{carList && carList[item.seedId].num}}</span>
              <van-icon name="add" @click.stop="addCar(item)"/>
            </div>
            <div class="seedCount" @click.stop="addCar(item)" v-else>
              <van-icon name="add" />
            </div>
          </div>
        </div>
        <div style="height: 5vw; background-color: #fff"></div>
      </van-list>
    </van-pull-refresh>

    <div style="height: 10vw"></div>
    <div class="van-goods-action">
      <div class="footerBtn entrustBtn" @click="nextStep">下一步</div>
    </div>
    <van-actionsheet v-model="modalShow" title="已选种子及肥料">
      <div class="goodsCar" v-if="totalNum()">
        <div class="itemGoods" v-for="item in Object.values(carList)">
          <div>
            <div class="itemGoodsName">{{item['seedName'] || item['fertName']}}</div>
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
    <div class="carBtn" @click="modalShow = true">
      <span class="iconCar"><span class="totalNum" v-show="totalNum()">{{totalNum()}}</span></span></div>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import Function from '@/util/function'
  import constant from '@/config/constant'
  import { Toast } from 'vant';

  export default {
    name: "chooseSeed",
    data () {
      return {
        modalShow: false,
        addShow: false,
        carList: {},
        sortType: -1,
        key: '',
        page: 0,
        count: 10,
        active: 0,
        carShow: false,
        finished: false,
        loading: false,
        isLoading: false,
        searchValue: '',
        seedData: [
          {
            seedId: 'as1321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'a2342321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'a2352521',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '种子',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          }
        ]
      }
    },
    computed: {
      ...mapState(['gardenCar']),
      recMod () {
        return this.$route.query.recMod
      }
    },
    mounted () {
      this.getSeedList();
      this.gardenCar ? this.carList = this.gardenCar : null
    },
    methods: {
      ...mapMutations([
        'addToLandCar', 'reduceLandToCar'
      ]),
      totalNum () {
        let totalNum = 0;
        if (this.carList) {
          for (let item in this.carList) {
            totalNum += this.carList[item].num
          }
          return totalNum
        }
      },
      toSeedInfo (seedId) {
        this.$router.push({
          path: '/seedDetails',
          query: {
            seedId,
            title: '种子详情'
          }
        })
      },
      reduceCar (data) {
        this.reduceLandToCar(data);
        this.carList = this.gardenCar;
      },
      addCar (data) {
        this.addToLandCar(data);
        this.carList = this.gardenCar;
      },
      changeActive (active) {
        if (active === 1) {
          if (this.sortType === constant.sortType.stockUp) {
            this.sortType = constant.sortType.stockDown; // 库存
            this.$refs.stockSort.$children[0].$el.style.transform = 'rotate(-90deg)';
          } else {
            this.sortType = constant.sortType.stockUp // 库存
            this.$refs.stockSort.$children[0].$el.style.transform = 'rotate(90deg)';
          }
          this.$refs.priceSort.$children[0].$el.style.transform = 'rotate(-90deg)';
        } else if (active === 2) {
          if (this.sortType === constant.sortType.priceUp) {
            this.sortType = constant.sortType.priceDown; // 价格
            this.$refs.priceSort.$children[0].$el.style.transform = 'rotate(-90deg)';
          } else {
            this.sortType = constant.sortType.priceUp; // 价格
            this.$refs.priceSort.$children[0].$el.style.transform = 'rotate(90deg)';
          }
          this.$refs.stockSort.$children[0].$el.style.transform = 'rotate(-90deg)';
        } else {
          this.sortType = constant.sortType.overall; // 综合
          this.$refs.stockSort.$children[0].$el.style.transform = 'rotate(-90deg)';
          this.$refs.stockSort.$children[0].$el.style.transform = 'rotate(-90deg)';
        }
        this.page = 0;
        this.getSeedList()
      },
      getSeedList () {
        this.isLoading = true;
        axios.post(api.garden.getSeedList, {
            key: this.key,
            page: this.page + 1,
            count: this.count,
            sortType: this.sortType
        }).then((res) => {
          this.isLoading = false;
          this.loading = false;
          this.finished = false;
          this.seedData = res.data.data
        }).catch((res) => {
          this.loading = false;
          this.finished = false;
          this.isLoading = false;
        })
      },
      ...mapActions(['setSelectedLands']),
      nextStep () {
        if (this.carList && (Object.values(this.carList).find(item => item.seedId))) {
          if (Number(this.recMod) === 1) {
            this.$router.push({
              path: '/chooseFertilizers'
            })
          } else if (Number(this.recMod) === 0) {
            this.$router.push({
              path: '/landBill'
            })
          }
        } else {
          Toast('请选择种苗')
        }
      },
      onSearch () {
        this.page = 0;
        this.getSeedList();
      },
      onCancel (val) {
        console.log(val);
      },
      goBack () {
        window.history.back()
      },
      onRefresh() {
        this.getSeedList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .itemGoods {
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
  }
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
    height: 15vw;
    width: 15vw;
    background: url("data:image/png;base64,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") no-repeat;
    background-size: 100% 100%;
    .totalNum {
      position: absolute;
      top: 1vw;
      right: 1vw;
      font-size: 3vw;
      color: #fff;
      border-radius: 13vw;
      background-color: #DE3B3B;
      padding: 0.8vw 1.8vw;
      min-width: 2vw;
      display: inline-block;
      text-align: center;
    }
  }

  .carBtn {
    border-radius: 50%;
    position: fixed;
    bottom: 15vw;
    right: 6vw;
    z-index: 9;
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
    top: 21.5vw;
    right: .1vw;
    .seedNum {
      font-size: 3.8vw;
      margin: 0 auto;
      color: #555555;
    }
  }
  .seedItem {
    background-color: #fff;
    padding-top: 5vw;
    padding-left: 4vw;
    padding-right: 4vw;
    display: flex;
    .seedPic {
      width: 28vw;
      height: 28vw;
      margin-right: 4vw;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .seedInfo {
      height: 28vw;
      width: 60vw;
      overflow: hidden;
      position: relative;
      .seedName {
        margin-bottom: 2vw;
        font-size: 4vw;
        font-weight: 700;
      }
      .seedSpec {
        margin-bottom: 6vw;
        font-size: 2.5vw;
        color: #959595;
      }
      .seedPrice {
        margin-bottom: 1vw;
        color: #F12020;
        font-size: 4vw;
        font-weight: 900;
        span {
          font-size: 3vw;
        }
      }
      .seedSeason {
        display: inline-block;
        padding: 0.5vw 2vw;
        background-color: #E9F2F2;
        color: #38ACA5;
        border-radius: 3vw;
        font-size: 2.5vw;
        text-align: center;
      }
      .seedCount {
        height: 6vw;
        width: 6vw;
        font-size: 6vw;
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #38ACA5;
        border-radius: 50%;
        position: absolute;
        top: 21.5vw;
        right: .1vw;
      }
    }
  }
  .van-tabbar-item--active {
    color: #38ACA5;
  }
 .van-tabbar-item.van-tabbar-item--active .van-tabbar-item__text {
    .van-icon-arrow {
      transform: rotate(90deg);
    }
  }
 .van-tabbar-item .van-tabbar-item__text {
    .van-icon-arrow {
      transform: rotate(-90deg);
      vertical-align: baseline;
      margin-left: 1.5vw;
      font-size: 2.5vw;
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
  .notLandRegionData {
    height: 60vw;
    text-align: center;
    color: #505050;
    display: flex;
    align-items: center;
    span {
      font-size: 5vw;
      flex: 1;
    }
  }
</style>
