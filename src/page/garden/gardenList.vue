<template>
    <div style="width: 100vw; height: 100vh">
      <van-nav-bar
        title="我的菜园"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 14vw"></div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-if="gardenList.length"
          v-model="loading"
          @load="getGardenList"
          :offset="30"
          :finished="finished">
            <van-cell class="gardenItem" v-for="(item, index) in gardenList" :key="index">
            <template slot="title">
              <div style="border-bottom: 1px solid #e5e5e5; padding: 3vw 3vw;">
                <span class="van-cell-text">菜园编号: <span class="useCopy landId ellipse" style="color: #505050;">{{item.landId}}</span></span>
                <div style="color:#53B2AC;float: right">长按复制</div>
              </div>
              <div class="gardenItemInfo">
                <div>
                  <div class="infoItem ellipse">菜园名称: <span>{{item.landName}}</span></div>
                  <div class="infoItem ellipse">规格: <span>{{item.landSize}}</span></div>
                  <div class="infoItem ellipse">开垦模式: <span>{{item.recMod === 0 ? '自理' : '托管'}}</span></div>
                  <div class="infoItem ellipse">租赁期限: <span>{{dateFormat(item.startDate, 'YYYY/MM/DD')}}-{{dateFormat(item.endDate, 'YYYY/MM/DD')}}</span></div>
                </div>
                <div class="gardenItemPic">
                  <img v-lazy="item.landPics[0]"/>
                </div>
                <div class="gardenInfoBtn"><span @click="goGardenInfo(item)">查看详情</span></div>
              </div>
            </template>
          </van-cell>
          <div class="noDataList"><span>已经到底啦~</span></div>
        </van-list>
        <div v-else class="notGardenData"><span>您还没有菜园哦,<br/>快点击下方的"订购菜园"成为农场主人吧~</span></div>
      </van-pull-refresh>
      <div style="height: 14vw"></div>
      <van-goods-action>
        <van-goods-action-big-btn @click="landRegion"><span class="icon-plus">＋</span><span class="footerBtnText">订购菜园</span></van-goods-action-big-btn>
      </van-goods-action>
    </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import Function from '@/util/function'
  export default {
    name: 'gardenList',
    data () {
      return {
        token: null,
        page: 0,
        count: 10,
        isLoading: false,
        finished: false,
        loading: false,
        gardenList: []
      }
    },
    mounted () {
      try {
        this.token = window.app.getToken();
      } catch (e) {
        this.$toast('获取token失败');
      }
      this.getGardenList()
    },
    methods: {
      dateFormat (date, format) {
        return Function.dateFormat(date, format)
      },
      landRegion () {
        this.$router.push({
          path: '/landRegionList'
        })
      },
      onRefresh() {
        this.page = 0;
        this.getGardenList()
      },
      getGardenList () {
        axios.post(api.my.landList, {
            page: this.page + 1,
            count: this.count,
        }).then(res => {
          this.page += 1;
          this.loading = false;
          this.isLoading = false;
          if (res.data.data.length) {
            this.gardenList.push(...res.data.data);
          } else {
            this.finished = true;
          }
        }).catch((err) => {
          console.log(err);
          this.loading = false;
          this.isLoading = false;
          this.finished = true;
        })
      },
      goGardenInfo (gardenInfo) {
        // TODO 跳转详情页
        this.$router.push({
          path: '/gardenInfo',
          query: {gardenId: gardenInfo.landId}
        })
      },
      onClickLeft () {
        if (window.app) {
          window.app.go2MainPage();
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .icon-plus {
    font-size: 5vw;
    font-weight: 900;
    vertical-align: middle;
  }
  .footerBtnText {
    margin-left: 1vw;
    margin-right: 4vw;
  }
  .van-button--bottom-action {
    background-color: #53B2AC;
  }
  .notGardenData {
    height: 160vw;
    text-align: center;
    color: #505050;
    display: flex;
    align-items: center;
    span {
      font-size: 5vw;
      flex: 1;
    }
  }
  .gardenInfoBtn {
    margin-top: 3vw;
    margin-bottom: 3vw;
    text-align: center;
    span {
      font-size: 3.6vw;
      color:#53B2AC;
      border: 1px solid #53B2AC;;
      border-radius: 5vw;
      padding: 1.6vw 4.5vw;
    }
  }
  .infoItem {
    max-width: 65vw;
    margin-bottom: 3vw;
    span {
      color: #505050;
      margin-left: 2vw;
    }
  }
  .gardenItemInfo {
    padding: 3vw 3vw;
    position: relative;
    overflow: hidden;
  }
  .gardenItem {
    margin-bottom: 1.4vw;
    font-size: 3.8vw;
  }
  .van-cell {
    padding: 0 0;
  }
  .gardenItemPic {
    width: 32vw;
    height: 24vw;
    overflow: hidden;
    position: absolute;
    right: 3vw;
    top: 3vw;
    border-radius: 3px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .landId {
    display: inline-block;
    width: 50vw;
    vertical-align: bottom;
  }
</style>
