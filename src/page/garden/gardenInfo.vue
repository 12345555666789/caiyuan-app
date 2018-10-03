<template>
  <div style="width: 100vw; height: 100vh">
    <van-nav-bar
      title="菜园详情"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getgardenInfo">
      <van-swipe style="height: 50vw; width: 100vw">
        <van-swipe-item v-for="(item, index) in gardenInfo.landVideos" :key="item">
          <div class="videoShadow" style="overflow: hidden;height: 50vw; width: 100vw" @click="videoPlay(item)">
            <van-icon name="play"/>
            <video id="videoView" :src="item" height="100%" width="100%" style="z-index: -1;position: absolute"></video>
          </div>
        </van-swipe-item>
        <van-swipe-item v-for="(item, index) in gardenInfo.landPics" :key="item">
          <img :src="item" height="100%" width="100%">
        </van-swipe-item>
      </van-swipe>
      <div class="gardenInfo">
        <van-cell-group>
          <van-cell title="菜园名称"><span class='valueColor'>{{gardenInfo.landName}}</span></van-cell>
          <van-cell title="菜园编号"><span class='useCopy valueColor'>{{gardenInfo.landId}}</span></van-cell>
          <van-cell title="菜园规格"><span class='valueColor'>{{gardenInfo.landSize + '平米'}}</span></van-cell>
          <van-cell title="开垦模式"><span class='valueColor'>{{gardenInfo.recMod ? '托管' : '自理'}}</span></van-cell>
          <van-cell title="租赁期限"><span class='valueColor'>{{dateFormat(gardenInfo.startDate, 'YYYY/MM/DD')}}-{{dateFormat(gardenInfo.endDate, 'YYYY/MM/DD')}}</span>
          </van-cell>
        </van-cell-group>
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
    <div style="height: 14vw"></div>
    <van-goods-action>
      <van-goods-action-big-btn @click="landRegion"><span class="icon-plus">＋</span><span
        class="footerBtnText">订购菜园</span></van-goods-action-big-btn>
    </van-goods-action>
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
    name: "gardenInfo",
    data() {
      return {
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        videoShow: false,
        isLoading: false,
        gardenId: this.$route.query.gardenId,
        gardenInfo: {},
        comments: []
      }
    },
    mounted () {
      this.getgardenInfo()
    },
    methods: {
      dateFormat (date, format) {
        return Function.dateFormat(date, format)
      },
      getComments () {
        axios.post(api.common.commentList, {
            page: this.page + 1,
            count: this.count,
            objId: this.gardenId,
            objType: constant.infoType.land
        }).then((res) => {
          this.page += 1;
          this.loading = false;
          if (res.data.data.comments.length) {
            this.comments.push(...res.data.data.comments);
          } else {
            this.finished = true;
          }
        }).catch(() => {
          this.finished = true;
          this.loading = false;
        })
      },
      sendComment () {
        this.message = this.message.replace(/\s/g, "");
        if (this.message) {
          axios.post(api.common.userAction, {
            objId: this.gardenId,
            actionType: constant.actionType.comment,
            objType: constant.infoType.land,
            content: this.message
          }).then(() => {
            this.message = '';
            this.$toast('发送成功');
            this.getgardenInfo();
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
      videoPlay(src) {
        this.videoSrc = src;
        this.videoShow = true;
      },
      onClickLeft() {
        window.history.back()
      },
      getgardenInfo() {
        axios.post(api.common.getInfo, {
            objId: this.gardenId,
            objType: constant.infoType.land
        }).then((res) => {
          this.gardenInfo = res.data.data;
          this.page = 0;
          this.comments = [];
          this.getComments();
          this.isLoading = false
        }).catch((err) => {
          this.isLoading = false
        })
      },
      landRegion() {
        this.$router.push({
          path: '/landRegionList'
        })
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
