<template>
  <div>
    <van-nav-bar
      title="选择农场"
      fixed
      left-arrow
      @click-left="goBack"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-if="landRegionList.length"
        v-model="loading"
        @load="getLandRegionList"
        :offset="30"
        :finished="finished">
        <van-cell class="landRegionItem"
                  v-for="(item, index) in landRegionList"
                  :key="index"
                  @click="toChooseGarden(item)">
          <template slot="title">
            <div class="landRegion">
              <div class="landRegionItemPic">
                <img v-lazy="item.farmPics[0]"/>
              </div>
              <div class="landRegionInfo">
                <p class="landName ellipse">{{item.farmName}}({{item.farmGrade}}:{{item.geologicalType === 1 ? '松软地质' : '沙石地质'}})</p>
                <p class="landDesc">{{item.farmDesc}}</p>
                <p class="landAddress ellipse">
                  <van-icon class="dominantHueText" name="location" />
                  {{item.address}}</p>
              </div>
              <div class="arrow">
                <van-icon name="arrow" />
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
      <div v-else class="notLandRegionData"><span>暂无数据</span></div>
    </van-pull-refresh>
    <div style="height: 14vw"></div>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: "landRegionList",
    data () {
      return {
        page: 0,
        count: 10,
        isLoading: false,
        finished: false,
        loading: false,
        landRegionList: [
          {
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          },{
            farmGrade: '一类土',
            geologicalType: 1,
            farmPics: ['http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg','http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'],
            farmName: '一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场一号农场',
            farmId: 'ad132',
            farmDesc: '地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…地处平原地带，适宜种植各种蔬…',
            address: '哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒哈尔滨市道里区西七道街56号洒…'
          }
        ]
      }
    },
    mounted () {
      this.getLandRegionList()
    },
    methods: {
      ...mapActions(['setLandData']),
      toChooseGarden (landData) {
        this.setLandData(landData);
        this.$router.push({path: '/chooseGarden',query: {landId: landData.farmId}})
      },
      goBack: function () {
        window.history.back()
      },
      onRefresh() {
        this.page = 0;
        this.getLandRegionList()
      },
      getLandRegionList () {
        axios.post(api.garden.landRegionList, {
            page: this.page + 1,
            limit: this.limit
        }).then((res) => {
          this.landRegionList.push(...res.data.data);
          this.loading = false;
          this.isLoading = false;
        }).catch((err) => {
          this.loading = false;
          this.isLoading = false;
          this.finished = false;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .landRegionItem {
    padding: 0 4vw;
  }
  .landRegionInfo {
    padding: 0 3.3vw;
    width: 61.5vw;
    .landName {
      font-size: 4vw;
      color: #1B1B1B;
      height: 7vw;
    }
    .landDesc {
      font-size: 3.5vw;
      color: #505050;
      height: 12vw;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-all;
    }
    .landAddress {
      color: #7D7D7D;
      font-size: 3.4vw;
      .van-icon {
        font-size: 3.5vw;
        vertical-align: text-top;
      }
    }
  }
  .landRegionItemPic {
    width: 25vw;
    height: 25vw;
    border-radius: 3px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .arrow {
    align-items: center;
    justify-content: center;
    text-align: center;
    display: flex;
    .van-icon {
      font-size: 4vw;
    }
  }
  .landRegion {
    display: flex;
    padding: 3vw 0;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E1E1E1;
  }
  .notLandRegionData {
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
  [class*=van-hairline]::after {
    border: 0;
  }
</style>
