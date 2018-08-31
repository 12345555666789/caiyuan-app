<template>
    <div>
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
                <span class="van-cell-text">菜园编号: <span class="useCopy" style="color: #505050;">{{item.gardenNo}}</span></span>
                <div style="color:#53B2AC;float: right">长按复制</div>
              </div>
              <div class="gardenItemInfo">
                <div>
                  <div class="infoItem ellipse">菜园名称: <span>{{item.gardenName}}</span></div>
                  <div class="infoItem ellipse">规格: <span>{{item.gardenSpec}}平米</span></div>
                  <div class="infoItem ellipse">开垦模式: <span>{{item.reclamationMode === 0 ? '自理' : '托管'}}</span></div>
                  <div class="infoItem ellipse">租赁期限: <span>{{item.leaseTerm}}</span></div>
                </div>
                <div class="gardenItemPic">
                  <img v-lazy="item.gardenImage"/>
                </div>
                <div class="gardenInfoBtn"><span @click="goGardenInfo(item)">查看详情</span></div>
              </div>
            </template>
          </van-cell>
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
  import { Toast } from 'vant';
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  export default {
    name: 'gardenList',
    data () {
      return {
        page: 0,
        limit: 10,
        isLoading: false,
        finished: false,
        loading: false,
        gardenList: [
          {
            gardenNo: 'ad75d',
            gardenName: '菜地1',
            gardenId: 789,
            gardenSpec: 60,
            leaseTerm: '2018/09/27-2019/09/27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 0,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenId: 790,
            gardenName: '菜地2',
            gardenSpec: 60,
            leaseTerm: '2018-09-27--2019-09-27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 1,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenName: '菜地1',
            gardenId: 789,
            gardenSpec: 60,
            leaseTerm: '2018/09/27-2019/09/27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 0,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenId: 790,
            gardenName: '菜地2',
            gardenSpec: 60,
            leaseTerm: '2018-09-27--2019-09-27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 1,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenName: '菜地1',
            gardenId: 789,
            gardenSpec: 60,
            leaseTerm: '2018/09/27-2019/09/27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 0,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenId: 790,
            gardenName: '菜地2',
            gardenSpec: 60,
            leaseTerm: '2018-09-27--2019-09-27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 1,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenName: '菜地1',
            gardenId: 789,
            gardenSpec: 60,
            leaseTerm: '2018/09/27-2019/09/27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 0,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          },
          {
            gardenNo: 'ad75d',
            gardenId: 790,
            gardenName: '菜地2',
            gardenSpec: 60,
            leaseTerm: '2018-09-27--2019-09-27',
            gardenImage: 'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
            reclamationMode: 1,
            fertilizer: '史丹利复合肥',
            cropSeed: '辣椒'
          }
        ]
      }
    },
    mounted () {
      this.getGardenList()
    },
    methods: {
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
        axios.get(api.garden.gardenList, {
          params: {
            page: this.page + 1,
            limit: this.limit
          }
        }).then((res) => {
          this.page = res.data.page;
          this.gardenList.push(...res.data.gardenList);
          this.loading = false;
          this.isLoading = false;
        }).catch((err) => {
          this.loading = false;
          this.isLoading = false;
          this.finished = false;
        })
      },
      goGardenInfo (gardenInfo) {
        // TODO 跳转详情页
        this.$router.push({
          path: '/gardenInfo',
          query: {gardenId: gardenInfo.gardenId}
        })
      },
      onClickLeft () {
        Toast('返回');
      }
    }
  }
</script>
<style lang="less" scoped>
  .icon-plus {
    font-size: 8vw;
    font-weight: 900;
    vertical-align: sub;
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
</style>
