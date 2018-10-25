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
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;" @click="toLiveRoom(item.liveDesc, item.liveUrl, item.activityId)">
                      <div class="videoShadow" style="width: 100%;height: 100%;position: absolute;"></div>
                      <div class="videoTitle">{{item.liveName}}</div>
                      <van-icon name="play" style="position: absolute"/>
                      <img width="100%" v-lazy="item.activityPics[0]">
                      <div class="liveLabel">{{item.title}}</div>
                      <div class="videoDesc">{{item.liveDesc}}</div>
                    </div>
                  </div>
                  <div class="liveVideo" v-else>
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;">
                      <div class="videoShadow" style="width: 100%;height: 100%;position: absolute;"></div>
                      <div class="videoTitle" v-if="item.liveDesc">{{item.liveDesc}}</div>
                      <div class="liveLabel">{{item.title}}</div>
                      <p class="noUrl">即将开播</p>
                      <img width="100%" v-lazy="item.activityPics[0]">
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
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;" @click="toLiveRoom(item.liveDesc, item.liveUrl)">
                      <div class="videoShadow" style="width: 100%;height: 100%;position: absolute;"></div>
                      <div class="farmTitle">{{item.farmName}}</div>
                      <van-icon name="play" style="position: absolute"/>
                      <img width="100%" v-lazy="item.farmPics[0]">
                      <div class="videoDesc" v-if="item.liveDesc">{{item.liveDesc}}</div>
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
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import Function from '@/util/function';
  import {mapMutations} from 'vuex'

  export default {
      name: "liveTelecast",
      data () {
        return {
          videoOptions: {
            source: {
              type: "rtmp/mp4",
              src: '',
              withCredentials: false
            },
            language: 'zh-CN',
            live: true,
            notSupportedMessage: '此视频暂无法播放，请稍后再试',
            autoplay: true,
            errorDisplay : false,
            width: 'auto'
          },
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
        ...mapMutations(['setLiveRoomData']),
        toLiveRoom (liveDesc, liveUrl, activityId) {
          this.setLiveRoomData({
            liveDesc,
            liveUrl,
            activityId
          });
          this.$router.push({
            path: '/liveRoom'
          })
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
          this.interactionPage = 0;
          this.interactionData = [];
          this.getInteractionTopList();
        },
        onRefreshOnline() {
          this.onlinePage = 0;
          this.onlineData = [];
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
  .noUrl {
    top: 0;
    left: 0;
    text-align: center;
    position: absolute;
    padding: 1vw 3vw;
    font-size: 3.5vw;
    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
  }
  .liveTitle {
    color: #646464;
  }
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
    width: 100%;
    box-shadow: 0 12px 20px #333 inset;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
  .liveLabel {
    position: absolute;
    bottom: 6vw;
    left: 0;
    margin: 2vw 2vw;
    padding: 0vw 1vw;
    font-size: 2.5vw;
    color: #fff;
    background: #41c7d9;
    border-radius: 4px;
  }
  .videoDesc {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 1vw 3vw;
    font-size: 3.5vw;
    color: #fff;
    width: 100%;
    box-shadow: 0 -12px 20px #333 inset;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
  .farmTitle {
    position: absolute;
    top: 0;
    left: 0;
    margin: 2vw 2vw;
    padding: 0vw 2vw;
    font-size: 3.5vw;
    color: #333;
    background: #ffffff87;
    border-radius: 4px;
  }
  .videoShadow {
    background: rgba(0, 0, 0, 0.3);
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
