<template>
    <div>
      <van-nav-bar
        title="菜园详情"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-pull-refresh v-model="isLoading" @refresh="getgardenInfo">
        <van-swipe style="height: 50vw">
          <van-swipe-item v-for="(item, index) in gardenInfo.gardenImages" :key="index">
            <img v-if="!(/\.mp4/g.test(item))" :src="item" height="100%" width="100%">
            <div v-else style="overflow: hidden;height: 50vw; width: 100vw" @click="videoPlay">
              <video id="videoView" autoplay webkit-playsinline :src="item" height="100%" width="100%" style="z-index: -1;position: absolute"></video>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div class="gardenInfo">
          <van-cell-group>
            <van-cell title="菜园名称"><span class='valueColor'>{{gardenInfo.gardenName}}</span></van-cell>
            <van-cell title="菜园编号"><span class='valueColor'>{{gardenInfo.gardenNo}}</span></van-cell>
            <van-cell title="菜园规格"><span class='valueColor'>{{gardenInfo.gardenSpec + '平米'}}</span></van-cell>
            <van-cell title="作物肥料"><span class='valueColor'>{{gardenInfo.fertilizer}}</span></van-cell>
            <van-cell title="作物种子"><span class='valueColor'>{{gardenInfo.cropSeed}}</span></van-cell>
            <van-cell title="开垦模式"><span class='valueColor'>{{gardenInfo.reclamationMode ? '托管' : '自理'}}</span></van-cell>
            <van-cell title="租赁期限"><span class='valueColor'>{{gardenInfo.leaseTerm}}</span></van-cell>
          </van-cell-group>
        </div>
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
 export default {
   name: "gardenInfo",
   data () {
     return {
       isLoading: false,
       gardenId: this.$route.query.gardenId,
       gardenInfo: {
         gardenName: '世外桃源',
         gardenId: 1231231,
         gardenImages: [
           'https://ykyl.oss-cn-qingdao.aliyuncs.com/1008/20180822150821/H9X46RbINX.mp4',
           'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
           'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
           'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg',
           'http://i1.ucaiyuan.com/h5/active/20180628_h5_pt/images/banner_p.jpg'
         ],
         gardenNo: 'ad12313',
         gardenSpec: 60,
         leaseTerm: '2019/02/18-2020/02/18',
         reclamationMode: 0,
         fertilizer: '金克拉氮磷钾',
         cropSeed: '西红柿',
         exposure: 4560,
         commentList: [
           {
             username: '卡路里一姐',
             avatarPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3303741086,3211617265&fm=27&gp=0.jpg',
             userComment: '哇塞! 看起来收成不错哦',
             creatDate: '2019/02/18'
           },{
             username: '卡路里一姐',
             avatarPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3303741086,3211617265&fm=27&gp=0.jpg',
             userComment: '哇塞! 看起来收成不错哦',
             creatDate: '2019/02/18'
           },{
             username: '卡路里一姐',
             avatarPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3303741086,3211617265&fm=27&gp=0.jpg',
             userComment: '哇塞! 看起来收成不错哦',
             creatDate: '2019/02/18'
           },{
             username: '卡路里一姐',
             avatarPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3303741086,3211617265&fm=27&gp=0.jpg',
             userComment: '哇塞! 看起来收成不错哦',
             creatDate: '2019/02/18'
           }

         ]
       }
     }
   },
   mounted () {
     this.getgardenInfo()
   },
   methods: {
     videoPlay (e) {
       if (videoView.paused) {
         videoView.play();
       } else {
         videoView.pause();
       }
     },
     onClickLeft () {
       window.history.back()
     },
     getgardenInfo () {
       axios.get(api.garden.getGardenInfo + this.gardenId).then((res) => {
         this.gardenInfo = res.data;
         this.isLoading = false
       }).catch((err) => {
         this.isLoading = false
       })
     },
     landRegion () {
       this.$router.push({
         path: '/landRegionList'
       })
     }
   }
 }
</script>

<style lang="less" scoped>
.gardenInfo {

}
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
</style>
