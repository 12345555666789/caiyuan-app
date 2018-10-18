<template>
  <div style="width: 100vw; height: 100vh">
    <van-nav-bar
      title="直播间"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getComments">
      <van-cell>
        <div id="liveVideo" style="width:100%; height:auto;"></div>
      </van-cell>
      <div class="gardenInfo">
        <p style="font-size: 3vw; padding: 1vw 3vw">评论 ({{comments.length}})</p>
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
            <div class="noDataList"><span>已经到底啦~</span></div>
          </van-list>
        </div>
      </div>
    </van-pull-refresh>
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
          "m3u8": "http://39.104.26.183:7070/live/test/index.m3u8",
          "autoplay" : true,
          "width" :  '100%',
          "height" : 'auto'
        },
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        isLoading: false,
        gardenInfo: {},
        comments: []
      }
    },
    computed: {
      ...mapState(['liveRoomData'])
    },
    mounted () {
      this.getComments();
      new TcPlayer('liveVideo', this.tcPlayerOption)
    },
    methods: {
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
          this.page += 1;
          this.loading = false;
          this.isLoading = false;
          if (res.data.data.comments.length) {
            this.comments.push(...res.data.data.comments);
          } else {
            this.finished = true;
          }
        }).catch(() => {
          this.finished = true;
          this.loading = false;
          this.isLoading = false;
        })
      },
      sendComment () {
        this.message = this.message.replace(/\s/g, "");
        if (this.message) {
          axios.post(api.common.userAction, {
            objId: this.liveRoomData.activityId,
            actionType: constant.actionType.comment,
            objType: constant.infoType.land,
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
      },
      commentDate (date) {
        return Function.dateFormat(date, 'YYYY-MM-DD')
      },
      cancelDate () {
        this.$refs.video.pause();
        this.videoSrc = '';
      },
      onClickLeft() {
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
