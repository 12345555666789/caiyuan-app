<template>
  <div style="width: 100vw; height: 100vh;background-color: #fff">
    <van-nav-bar
      :title="liveRoomData.title"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getComments">
      <van-cell>
        <div ref="liveVideo" id="liveVideo" style="width:100%; height:auto;"></div>
        <h4><b>{{activityInfo.activityName}}</b></h4>
      </van-cell>
      <div class="liveInfo" v-if="liveRoomData && liveRoomData.activityId">
        <van-cell style="min-height: 35vw">
          <h4><b>活动简介</b></h4>
          <div class="farmName">{{activityInfo.activityName}}</div>
          <div class="farmDesc">{{activityInfo.activityDesc}}</div>
          <div class="activityPic"><img v-lazy="activityInfo.activityPic && activityInfo.activityPic[0]"></div>
        </van-cell>
        <p style="font-size: 3vw; padding: 1vw 3vw">评论 ({{activityInfo.commentCount}})</p>
        <div class="comments">
          <div class="commentSend">
            <van-cell-group>
              <van-field
                v-model.trim="message"
                type="textarea"
                placeholder="评论..."
                rows="1"
                autosize
              >
                <van-button slot="button" size="small" type="default" @click="sendComment">发送</van-button>
              </van-field>
            </van-cell-group>
          </div>
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="30"
            @load="getComments"
          >
            <div class="comment" v-for="(item, index) in comments" :key="index">
              <div class="iconurl">
                <img :src="item.iconurl" width="100%" height="100%">
              </div>
              <div class="commentContent">
                <div class="nickName">{{item.nickName}}<span class="commentDate">{{commentDate(item.commentDate)}}</span></div>
                <div class="commentText">{{item.content}}</div>
              </div>
            </div>
            <div class="noDataList" v-show="!loading"><span>已经到底啦~</span></div>
          </van-list>
        </div>
      </div>
      <div class="farmInfo" v-else>
        <van-cell v-if="Object.values(farmInfo).length">
          <h4><b>农场简介</b></h4>
          <div class="farmName">{{farmInfo.farmName}}</div>
          <div class="farmGradeName">{{farmInfo.farmGradeName}}<span class="geologicalTypeName">:{{farmInfo.geologicalTypeName}}</span></div>
          <div class="farmAddress"><van-icon class="dominantHueText" name="location" />{{farmInfo.address}}</div>
          <div class="farmDesc">{{farmInfo.farmDesc}}</div>
          <div class="farmPic"><img v-lazy="farmInfo.farmPics[0]"></div>
        </van-cell>
      </div>
    </van-pull-refresh>
    <div style="height: 10vw"></div>
  </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import constant from '@/config/constant';
  import Function from '@/util/function';
  import {mapState} from 'vuex';
  export default {
    name: "liveRoom",
    data() {
      return {
        tcPlayer: null,
        tcPlayerOption: {
          "m3u8": '',
          "live": true,
          "width": '100%',
          "height": 'auto',
          "systemFullscreen": true
        },
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        isLoading: false,
        farmInfo: {},
        activityInfo: {},
        comments: []
      }
    },
    computed: {
      ...mapState(['liveRoomData'])
    },
    activated () {
      this.page = 0;
      this.comments = [];
      this.farmInfo = {};
      this.activityInfo = {};
      if (!!this.liveRoomData.activityId) {
        this.getActivityInfo();
      } else if (!!this.liveRoomData.farmId) {
        this.getFarmInfo()
      }
      if (window.TcPlayer) {
        this.setLive();
      }
    },
    methods: {
      getActivityInfo () {
        axios.post(api.common.getInfo, {
          objId: this.liveRoomData.activityId,
          objType: constant.infoType.activity
        }).then(res => {
          this.activityInfo = res.data.data;
          this.getComments();
        })
      },
      getFarmInfo() {
        axios.post(api.common.getInfo, {
          objId: this.liveRoomData.farmId,
          objType: constant.infoType.farm
        }).then(res => {
          this.farmInfo = res.data.data
        })
      },
      setLive() {
        if (this.liveRoomData.liveUrl) {
          this.tcPlayerOption.m3u8 = this.liveRoomData.liveUrl;
        }
        this.tcPlayer = new TcPlayer('liveVideo', this.tcPlayerOption);
      },
      dateFormat (date, format) {
        return Function.dateFormat(date, format)
      },
      getComments () {
        axios.post(api.common.commentList, {
            page: this.page + 1,
            count: this.count,
            objId: this.liveRoomData.activityId,
            objType: constant.infoType.activity
        }).then((res) => {
          this.loading = false;
          this.isLoading = false;
          if (res.data.data.comments.length) {
            this.page += 1;
            if (this.comments.length) {
              this.comments.forEach(item => {
                res.data.data.comments.forEach(item1 => {
                  if (item.commentId !== item1.commentId) {
                    this.comments.push(item1);
                  }
                })
              });
            } else {
              this.comments.push(...res.data.data.comments);
            }
          } else {
            this.finished = true;
          }
        }).catch(() => {
          this.finished = true;
          this.loading = false;
          this.isLoading = false;
        })
      },
      toLogin () {
        if (window.app.toLogin) {
          window.app.toLogin()
        } else {
          this.$toast('Native错误');
        }
      },
      sendComment () {
        this.message = this.message.replace(/\s/g, "");
        if (window.app.getToken && window.app.getToken()) {
          if (this.message) {
            axios.post(api.common.userAction, {
              objId: this.liveRoomData.activityId,
              actionType: constant.actionType.comment,
              objType: constant.infoType.activity,
              content: this.message
            }).then(() => {
              this.message = '';
              this.$toast('发送成功');
              this.getComments()
            }).catch(err => {
              console.log(err);
              this.$toast('发送失败');
            });
          } else {
            this.$toast('不能发送空内容哦');
            this.message = ''
          }
        } else {
          this.toLogin()
        }
      },
      commentDate (date) {
        return Function.dateFormat(date, 'YYYY-MM-DD H:M')
      },
      cancelDate () {
        this.$refs.video.pause();
        this.videoSrc = '';
      },
      onClickLeft() {
        this.tcPlayer ? this.tcPlayer.destroy() : null;
        if (this.$route.query.from) {
          window.app.goBackApp();
        } else {
          window.history.back()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .farmPic {
    width: 40vw;
    height: 24vw;
    overflow: hidden;
    border-radius: 4px;
    position: absolute;
    right: 0;
    top: 0;
    img {
      width: 100%;
    }
  }
  .activityPic {
    overflow: hidden;
    border-radius: 4px;
    img {
      width: 100%;
    }
  }
  .comments {
    background: #fff;
    .commentSend {
      padding: 0 3vw;
      .van-cell {
        padding: 10px 0;
      }
      [class*=van-hairline]::after {
        border-top: 0 #fff;
      }
    }
    .comment {
      position: relative;
      min-height: 10vw;
      padding: 7vw 4vw;
      padding-bottom: 0;
      display: flex;
      .commentContent {
        flex: 8;
        .nickName {
          font-size: 3.2vw;
          color: #505050;
        }
        .commentText {
          font-size: 3.8vw;
        }
        .commentDate {
          float: right;
          color: #A1A1A1;
          font-size: 3vw;
        }
      }
      .iconurl {
        width: 10vw;
        height: 10vw;
        overflow: hidden;
        border-radius: 50%;
        border: 1px solid;
        margin-right: 2vw;
        flex: 1;
      }
    }
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
</style>
