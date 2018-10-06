<template>
  <div style="height: 100vh; width: 100vw">
    <van-nav-bar
      title="直播"
      @click-left="goApp"
      left-arrow></van-nav-bar>
    <van-tabs v-model="active" swipeable sticky>
      <van-tab title="活动直播">
        <van-pull-refresh v-model="interactionIsLoading" @refresh="onRefreshInteraction">
          <van-list
            v-if="interactionData.length"
            v-model="interactionLoading"
            @load="getInteractionTopList"
            style="padding: 0 3vw;background-color: #fff;"
            :finished="interactionFinished">
            <van-cell-group v-for="item in interactionData" :key="item.activityId">
              <van-cell>
                <div class="liveContent">
                  <div class="liveTitle" v-show="!item.liveUrl"><span>{{dateFormat(item.startDate)}}开播</span></div>
                  <div class="liveVideo" v-if="!!item.liveUrl">
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;" @click="videoPlay(item.liveUrl)">
                      <div class="videoTitle">{{item.liveName}}</div>
                      <van-icon name="play"/>
                      <video class="videoView" v-lazy="item.liveUrl" height="100%" width="100%" style="z-index: -1;position: absolute"></video>
                    </div>
                  </div>
                  <div class="livePic" v-else>
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;">
                      <div class="videoTitle">{{item.liveName}}</div>
                      <p>即将开播</p>
                      <img height="100%" width="100%" v-lazy="item.activityPics[0]">
                    </div>
                  </div>
                </div>
              </van-cell>
            </van-cell-group>
          </van-list>
          <div class="noDataList"><span>已经到底啦~</span></div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="在线直播">
        <van-pull-refresh v-model="onlineIsLoading" @refresh="onRefreshOnline">
          <van-list
            v-if="onlineData.length"
            v-model="onlineLoading"
            @load="getOnlineTopList"
            style="padding: 0 3vw;background-color: #fff;"
            :finished="onlineFinished">
            <van-cell-group v-for="item in onlineData" :key="item.farmId">
              <van-cell>
                <div class="liveContent">
                  <div class="liveVideo">
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;" @click="videoPlay(item.liveUrl)">
                      <div class="videoTitle">{{item.farmName}}</div>
                      <van-icon name="play"/>
                      <video class="videoView" v-lazy="item.liveUrl" height="100%" width="100%" style="z-index: -1;position: absolute"></video>
                    </div>
                  </div>
                </div>
              </van-cell>
            </van-cell-group>
          </van-list>
          <div class="noDataList"><span>已经到底啦~</span></div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-popup v-model="videoShow" :overlay="true" @click-overlay="cancelDate">
      <video ref="video" :src="videoSrc" controls autoplay height="100%" width="100%"></video>
    </van-popup>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import Function from '@/util/function'
    export default {
      name: "liveTelecast",
      data () {
        return {
          videoShow: false,
          videoSrc: '',
          onlineLoading: false,
          interactionLoading: false,
          interactionFinished: false,
          onlineFinished: false,
          interactionIsLoading: false,
          onlineIsLoading: false,
          active: 0,
          interactionTabActive: 0,
          onlineTabActive: 0,
          interactionSortType: 20,
          onlineSortType: 50,
          onlinePage: 0,
          interactionPage: 0,
          count: 10,
          interactionData: [],
          onlineData: []
        }
      },
      mounted () {
        this.getInteractionTopList();
        this.getOnlineTopList();
      },
      methods: {
        cancelDate () {
          this.$refs.video.pause();
          this.videoSrc = '';
        },
        videoPlay(src) {
          this.videoSrc = src;
          this.videoShow = true;
        },
        dateFormat (date) {
          return Function.dateFormat(date, 'YYYY年MM月DD日 H:M')
        },
        goApp () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        },
        onRefreshInteraction() {
          this.getInteractionTopList();
        },
        onRefreshOnline() {
          this.getOnlineTopList();
        },
        getInteractionTopList () {
          axios.post(api.live.getInteractionTopList, {
            count: this.count,
            page: this.interactionPage + 1
          }).then(res => {
            this.interactionPage += 1;
            this.interactionLoading = false;
            this.interactionIsLoading = false;
            if (res.data.data.length) {
              this.interactionData.push(...res.data.data)
            } else {
              this.interactionFinished = true
            }
          })
        },
        getOnlineTopList () {
          axios.post(api.live.getOnlineTopList, {
          count: this.count,
          page: this.onlinePage + 1
           }).then(res => {
            this.onlinePage += 1;
            this.onlineLoading = false;
            this.onlineIsLoading = false;
            if (res.data.data.length) {
              this.onlineData.push(...res.data.data)
            } else {
              this.onlineFinished = true
            }
          })
        }
      }
    }
</script>

<style scoped lang="less">
  .liveVideo {
    border-radius: 2vw;
    overflow: hidden;
  }
  .videoTitle {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1vw 3vw;
    font-size: 3.5vw;
    color: #fff;
    max-width: 70vw;
    text-overflow: ellipsis;
  }
  .videoShadow {
    background: rgba(0, 0, 0, 0.54);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
    .van-icon-play {
      color: #fff;
      font-size: 10vw;
      display: flex;
      justify-content: center;
      justify-items: center;
      align-items: center;
    }
  }
</style>
