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
        <van-tabbar-item>综合<van-icon name="arrow" /></van-tabbar-item>
        <van-tabbar-item>库存<van-icon name="arrow" /></van-tabbar-item>
        <van-tabbar-item>价格<van-icon name="arrow" /></van-tabbar-item>
      </van-tabbar>
      <van-list
        v-if="seedData.length"
        v-model="loading"
        @load="getSeedList"
        :offset="30"
        :finished="finished">
        <div class="seedItem" v-for="item in seedData">
          <div class="seedPic">
            <img v-lazy="item.seedPics[0]">
          </div>
          <div class="seedInfo">
            <div class="seedName">{{item.seedName}}</div>
            <div class="seedSpec">{{item.seedSpec}}</div>
            <div class="seedPrice"><span>¥</span>{{item.price}}</div>
            <div class="seedSeason">{{item.season}}</div>
            <div class="seedCount"><van-icon name="add" /></div>
          </div>
        </div>
        <div style="height: 5vw; background-color: #fff"></div>
      </van-list>
    </van-pull-refresh>

    <div style="height: 10vw"></div>
    <div class="van-goods-action">
      <div class="footerBtn entrustBtn" @click="nextStep">下一步</div>
    </div>
    <van-popup v-model="carShow" position="bottom" :overlay="true" click-overlay="cancelDate">

    </van-popup>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters} from 'vuex'
  import Function from '@/util/function'
  import constant from '@/config/constant'
  import { Toast } from 'vant';

  export default {
    name: "chooseGarden",
    data () {
      return {
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
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
            seedId: 'as1321',
            seedName: '西瓜',
            seedType: 2,
            seedPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            seedSpec: '每袋500g',
            price: 500.33,
            seedDesc: '来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种, 薄皮,无子,沙瓤来自新疆新密产区新培育品种,薄皮,无子,沙瓤',
            season: '全季',
            stock: 999
          },{
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
        ]
      }
    },
    computed: {
      ...mapGetters(['gardenOrder']),
      recMod () {
        return this.$route.query.recMod
      }
    },
    mounted () {
      this.getSeedList()
    },
    methods: {
      changeActive (active) {
        if (active === 1) {
          this.sortType = 10 // 库存
        } else if (active === 2) {
          this.sortType = 40 // 价格
        } else {
          this.sortType = -1
        }
        this.page = 0;
        this.getSeedList()
      },
      getSeedList () {
        axios.get(api.garden.getSeedList, {
          params: {
            key: this.key,
            page: this.page + 1,
            count: this.count,
            sortType: this.sortType
          }
        }).then((res) => {
          this.seedData = res.data.data
        })
      },
      ...mapActions(['setSelectedLands']),
      nextStep () {

      },
      onSearch (val) {
        console.log(val);
      },
      onCancel (val) {
        console.log(val);
      },
      goBack () {
        window.history.back()
      },
      onRefresh() {

      }
    }
  }
</script>

<style lang="less" scoped>
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
