<template>
    <div style="height: 100vh; width: 100vw">
      <van-nav-bar
        title="排行榜"
        left-arrow
        @click-left="goApp"></van-nav-bar>
      <van-tabs v-model="active" swipeable sticky>
        <van-tab title="菜园">
          <van-pull-refresh v-model="landIsLoading" @refresh="onRefreshLand">
          <van-tabbar v-model="landTabActive" :fixed="false" style="margin-bottom: 1vw;">
            <van-tabbar-item @click="changeLandActive(0)" ref="overallSort">浏览量<van-icon name="arrow" /></van-tabbar-item>
            <van-tabbar-item @click="changeLandActive(1)" ref="stockSort">热度<van-icon name="arrow" /></van-tabbar-item>
          </van-tabbar>
            <van-list
              v-if="landData.length"
              v-model="landLoading"
              @load="getLandTopList"
              :offset="30"
              :finished="landFinished">
              <div class="landItem" v-for="item in landData">
                
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="地主">
          <van-pull-refresh v-model="owerIsLoading" @refresh="onRefreshOwer">
          <van-tabbar v-model="owerTabActive" :fixed="false" style="margin-bottom: 1vw;">
            <van-tabbar-item @click="changeOwerActive(0)" ref="landCountSort">菜园数量<van-icon name="arrow" /></van-tabbar-item>
            <van-tabbar-item @click="changeOwerActive(1)" ref="priceSort">费用<van-icon name="arrow" /></van-tabbar-item>
          </van-tabbar>
            <van-list
              v-if="owerData.length"
              v-model="owerLoading"
              @load="getOwerTopList"
              :offset="30"
              :finished="owerFinished">

            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'

  export default {
    name: "landTopList",
    data () {
      return {
        owerLoading: false,
        landLoading: false,
        landFinished: false,
        owerFinished: false,
        landIsLoading: false,
        owerIsLoading: false,
        active: 0,
        landTabActive: 0,
        owerTabActive: 0,
        landSortType: 20,
        owerSortType: 50,
        owerPage: 0,
        landPage: 0,
        count: 10,
        landData: [],
        owerData: []
      }
    },
    mounted () {
      this.getLandTopList();
      this.getOwerTopList();
    },
    methods: {
      onRefreshLand() {
        this.getLandTopList();
      },
      onRefreshOwer() {
        this.getOwerTopList();
      },
      goApp () {
        if (window.app.go2MainPage) {
          window.app.go2MainPage();
        }
      },
      changeLandActive (active) {
        if (active === 0) {
          if (this.landSortType === constant.sortType.viewUp) {
            this.landSortType = constant.sortType.viewDown; // 浏览量
            this.$refs.overallSort.$children[1].$el.style.transform = 'rotate(-90deg)';
          } else {
            this.landSortType = constant.sortType.viewUp; // 浏览量
            this.$refs.overallSort.$children[1].$el.style.transform = 'rotate(90deg)';
          }
          this.$refs.stockSort.$children[1].$el.style.transform = 'rotate(-90deg)';
        } else if (active === 1) {
          if (this.landSortType === constant.sortType.commentsUp) {
            this.landSortType = constant.sortType.commentsDown; // 价格
            this.$refs.stockSort.$children[1].$el.style.transform = 'rotate(-90deg)';
          } else {
            this.landSortType = constant.sortType.commentsUp; // 价格
            this.$refs.stockSort.$children[1].$el.style.transform = 'rotate(90deg)';
          }
          this.$refs.overallSort.$children[1].$el.style.transform = 'rotate(-90deg)';
        }
        this.owerPage = 0;
        this.getLandTopList()
      },
      changeOwerActive (active) {
        if (active === 0) {
          if (this.owerSortType === constant.sortType.scaleUp) {
            this.owerSortType = constant.sortType.scaleDown; // 规模
            this.$refs.landCountSort.$children[1].$el.style.transform = 'rotate(-90deg)';
          } else {
            this.owerSortType = constant.sortType.scaleUp; // 规模
            this.$refs.landCountSort.$children[1].$el.style.transform = 'rotate(90deg)';
          }
          this.$refs.priceSort.$children[1].$el.style.transform = 'rotate(-90deg)';
        } else if (active === 1) {
          if (this.owerSortType === constant.sortType.consumeUp) {
            this.owerSortType = constant.sortType.consumeDown; // 费用
            this.$refs.priceSort.$children[1].$el.style.transform = 'rotate(-90deg)';
          } else {
            this.owerSortType = constant.sortType.consumeUp; // 费用
            this.$refs.priceSort.$children[1].$el.style.transform = 'rotate(90deg)';
          }
          this.$refs.landCountSort.$children[1].$el.style.transform = 'rotate(-90deg)';
        }
        this.landPage = 0;
        this.getOwerTopList()
      },
      getLandTopList () {
        axios.post(api.ranking.landRanking, {
          page: this.landPage + 1,
          count: this.count,
          sortType: this.landSortType
        }).then((res) => {
          this.landIsLoading = false;
          this.landLoading = false;
          if (res.data.data.length) {
            this.landData.push(...res.data.data);
          } else {
            this.landFinished = true;
          }
        }).catch((res) => {
          this.landLoading = false;
          this.landIsLoading = false;
          this.landFinished = true;
        })
      },
      getOwerTopList () {
        axios.post(api.ranking.owerRanking, {
          page: this.owerPage + 1,
          count: this.count,
          sortType: this.owerSortType
        }).then((res) => {
          this.owerIsLoading = false;
          this.owerLoading = false;
          if (res.data.data.length) {
            this.owerData.push(...res.data.data);
          } else {
            this.owerFinished = true;
          }
        }).catch((res) => {
          this.owerLoading = false;
          this.owerFinished = true;
          this.owerIsLoading = false;
        })
      }
    }
  }
</script>

<style scoped lang="less">
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
</style>
