<template>
  <div style="height: 100vh; width: 100vw">
    <van-nav-bar
      v-if="!$route.query.isShare"
      title="圈子"
      fixed
      left-arrow
      @click-right="share"
      @click-left="goApp">
      <span class="iconShare" slot="right"></span>
    </van-nav-bar>
    <div v-if="!$route.query.isShare" style="height: 15vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getmomentInfo">
      <div class="momentInfo" v-show="momentInfo.createDate">
        <div class="momentContent">
          <p class="momentTitle">{{momentInfo.title}}</p>
          <div class="userInfo">
            <span class="avatar"><img v-lazy="momentInfo.iconurl"></span>
            <span class="username">{{momentInfo.username}}</span>
            <span class="createDate">{{commentDate(momentInfo.createDate)}}</span>
          </div>
          <p class="momentDesc">{{momentInfo.momentDesc}}</p>
          <div class="momentPics">
            <div class="momentPic" v-for="item in momentInfo.momentPics">
              <img v-lazy="item">
            </div>
          </div>
          <div class="likeCount" v-if="!$route.query.isShare">
            <span class="deleteMoment" v-if="userInfo.userId === momentInfo.userid"><van-button plain type="danger" size="small" @click="deleteMoment" plain>删除</van-button></span>
            <span v-if="isLike" class="likedIcon"></span>
            <span v-else class="likeIcon" @click="like"></span>
            <span class="count">{{momentInfo.likeCount}}</span>
          </div>
        </div>
        <p style="font-size: 3vw; padding: 1vw 3vw">评论 ({{momentInfo.commentCount}})</p>
        <div class="comments">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="getComments">
            <div class="comment" v-for="(item, index) in comments" :key="index">
              <div class="iconurl">
                <img v-lazy="item.iconurl" width="100%" height="100%">
              </div>
              <div class="commentContent">
                <div class="nickName">{{item.nickName}}<span class="commentDate">{{commentDate(item.commentDate)}}</span></div>
                <div class="commentText">{{item.content}}</div>
              </div>
            </div>
            <div class="noDataList" v-if="comments.length && !loading"><span>已经到底啦~</span></div>
          </van-list>
        </div>
      </div>
    </van-pull-refresh>
    <div style="height: 14vw"></div>
    <div class="commentSend" v-if="!$route.query.isShare">
      <van-cell-group>
        <van-field
          v-model.trim="message"
          type="textarea"
          placeholder="说说你的想法吧~"
          rows="1"
          autosize>
          <van-button slot="button" size="small" type="default" @click="sendComment">发送</van-button>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import Function from '@/util/function'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "momentInfo",
    data() {
      return {
        isMe: false,
        isLike: false,
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        videoShow: false,
        isLoading: false,
        momentId: this.$route.query.momentId,
        momentInfo: {},
        comments: []
      }
    },
    computed: {
      ...mapState(['userInfo', 'userAction'])
    },
    mounted () {
      this.getmomentInfo();
      if (window.app.getToken && window.app.getToken()) {
        this.getUserInfo();
      }
    },
    methods: {
      ...mapMutations(['setUserAction', 'setUserInfo']),
      deleteMoment () {
        this.$dialog.confirm({
          title: '提示',
          message: '确认要删除吗'
        }).then(() => {
          // on confirm
          axios.post(api.my.deleteMoment + this.$route.query.momentId).then(() => {
            this.$toast('已删除');
            if (window.app.refreshMoment) {
              try {
                window.app.refreshMoment()
              } catch (e) {
                console.log(e);
              }
            }
            this.goApp();
          })
        }).catch(() => {
          // on cancel
        });
      },
      getUserInfo () {
        axios.post(api.my.userInfo).then(res => {
          this.setUserInfo(res.data.data);
          this.checkAction();
        })
      },
      toLogin () {
        if (window.app.toLogin) {
          window.app.toLogin()
        } else {
          this.$toast('Native错误');
        }
      },
      like () {
        axios.post(api.common.userAction, {
          actionType: constant.actionType.like,
          objId: this.momentInfo.momentId || this.$route.query.momentId,
          objType: constant.infoType.moment
        }).then(() => {
          this.isLike = true;
          this.setUserAction({
            actionType: constant.actionType.like,
            objId: this.momentInfo.momentId || this.$route.query.momentId,
            objType: constant.infoType.moment,
            userId: this.userInfo.userId
          });
          this.getmomentInfo();
        })
      },
      checkAction () {
        if (this.userAction[this.userInfo.userId]) {
          this.userAction[this.userInfo.userId][this.$route.query.momentId] === this.$route.query.momentId ? this.isLike = true : this.isLike = false
        }
      },
      share () {
        if (window.app.shareInfo) {
          let shareContent = {
            context: this.momentInfo.momentDesc,
            shareUrl: window.location.href + '&isShare=1',
            title: this.momentInfo.title,
            imageurl: this.momentInfo.momentPics[0]
          };
          window.app.shareInfo(JSON.stringify(shareContent))
        }
      },
      dateFormat (date, format) {
        return Function.dateFormat(date, format)
      },
      getComments () {
        axios.post(api.common.commentList, {
          page: this.page + 1,
          count: this.count,
          objId: this.momentInfo.momentId || this.$route.query.momentId,
          objType: constant.infoType.moment
        }).then((res) => {
          this.loading = false;
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
        })
      },
      sendComment () {
        this.message = this.message.replace(/\s/g, "");
        if (this.message) {
          axios.post(api.common.userAction, {
            objId: this.momentInfo.momentId,
            actionType: constant.actionType.comment,
            objType: constant.infoType.moment,
            content: this.message
          }).then(() => {
            this.message = '';
            this.$toast('发送成功');
            this.getmomentInfo();
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
        return Function.dateFormat(date, 'YYYY-MM-DD H:M')
      },
      cancelDate () {
        this.$refs.video.pause();
        this.videoSrc = '';
      },
      videoPlay(src) {
        this.videoSrc = src;
        this.videoShow = true;
      },
      goApp () {
        if (window.app.refreshMoment) {
          window.app.refreshMoment();
          if (window.app.goBackApp) {
            window.app.goBackApp();
          } else {
            this.$toast('Native错误');
          }
        } else if (window.app.goBackApp) {
          window.app.goBackApp();
        } else {
          this.$toast('Native错误');
        }
      },
      getmomentInfo() {
        axios.post(api.common.getInfo, {
          objId: this.$route.query.momentId,
          objType: constant.infoType.moment
        }).then((res) => {
          this.momentInfo = res.data.data;
          this.page = 0;
          this.comments = [];
          this.getComments();
          this.isLoading = false
        }).catch((err) => {
          this.isLoading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .likeCount {
    text-align: right;
    margin-top: 5vw;
    .deleteMoment {
      float: left;
    }
    .likeIcon {
      width: 8vw;
      height: 8vw;
      display: inline-block;
      vertical-align: bottom;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAMAAAAPkIrYAAAAWlBMVEUAAAChoaGioqKenp6ioqKioqKgoKChoaGioqKioqKfn5+ioqKioqKhoaGioqKioqKhoaGgoKCioqKioqKhoaGioqKioqKhoaGjo6OhoaGioqKhoaGhoaGhoaH2U/h2AAAAHXRSTlMA6/MZg44kQ1pLBg163a1x5BNSM8plPLkropXTwXI/v/EAAAISSURBVFjD7ZfblqMgEEUjRASDYrTV3M7//+ZUdSch093epnibnIfIWi52irri7q3/RYchr+twKhOgzBmsLD/KrfrAXfVBysqJorKMf4MQpSsgs8YEot2EpyyIsadnSfapk4zVA+h44RTgRCg2pzK86hogyKI4AuOnm0wF5GLXX0pencguL2INAMIzCFaaXVmxY1kOgsj1ZEz1le4eaIyE1eLh8PICfGiJWSOxTl8BPXNABayOC+eeHDUXtyxR4e6ss+yMpnnZ74nb/7tZ3AT9a5Hj3BZF4ZxrW0tqu9UODACu+km+4Keufp0Lh+bhreixn6qXTTtoW+FbMZehUn+LYfvpkcOO6ENeNyDdvgVOF5bVtq1j2ZzLYqIY3K15/B+r6paiw8FtJ99EqRWu6JqJQ1r1ivLDwnCda5BHHoRjT37wBFWLnLkG2T3HaZGtZQ3Z78UQCOB261lzw4lbqNnIYhd3iVh9HMBiVoiNW8oq98A1ESsOATnrUMchIGaNnJJSViyVc5mGpWM5ylkK8IlYBkBIxBoAZROxLLeDRKxAWwY5K25JxKqBRidiUapWZSIW3112iVg8IRKxNLEuYlacXD4RyxHLJmL1xCp+feM5iTexLsQykxbn5QaWuQLZdGNT3mitLbP0kroxhnHiypSRPp9LAqk6TXXvGhul+plvg2wTqXKz96ne79cqtMfdW2+99QcEjUnq3oVLkQAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100% 100%;
    }
    .likedIcon {
      width: 8vw;
      height: 8vw;
      display: inline-block;
      vertical-align: bottom;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAMAAAAPkIrYAAAAYFBMVEUAAAD/cnL/cHD/b2//b2//b2//b2//cHD/b2//b2//cHD/b2//cHD/bm7/b2//b2//b2//b2//b2//bm7/b2//b2//b2//b2//b2//b2//b2//b2//bm7/b2//b2//b29la1TQAAAAH3RSTlMACxKDupD5XPPnsYtJGVDt3sZ2KiNwZUE7onxUM9jNvkoeMwAAAWVJREFUWMPt18tugzAQhWGwg28Yc4dASOb937KNqta0Mg14Zhf+FatPcGTJIjl7l9JrbkzfUlDdJOCzMmP4t6rhK2FSrJXDd6pHUsUdfqoLnDWW3lLI/QcBPouey4cbLDVrK8dNX62tGWVdYZ2km0ssKEuvLd1hqJuH0Gf1AusuDLO8hnUmxS7veyC+sdO/LTHEWxP8bXLjaK117naTUrpl94A9vEo8mn0TjhpeJwzbQckK9iT49pXz3ME+n2BnVRembK1LpZRhByzhglTjz/d+C3hwIRVl5QGK1RBlzQFrgThrCK0VadmAlUdaS8DK4izV0lm6o7PuBZ1VE1oXRmeZlM6aEjoro7MEJ7R6OktJOqu0hNaVztItoVXQWVVCZz0ILUNoZYRWQ2hJD6DvoTFozVFWF7RsjFVu/UZFWFkSrhGHrardsJg5aqkh2SzT4oCl7i75p3aYOefyeU3xVzWOJWdnZx/d+QBjGW086gAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100% 100%;
    }
    .count {
      vertical-align: super;
      color: #A1A1A1;
    }
  }
  .momentContent {
    background-color: #fff;
    padding: 5vw 3vw;
    width: 100vw;
    overflow: hidden;
    .momentTitle {
      font-size: 4.8vw;
      font-weight: 600;
      margin-bottom: 4vw;
    }
    .userInfo {
      margin-bottom: 8vw;
      .avatar {
        display: inline-block;
        width: 8vw;
        height: 8vw;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 2vw;
        vertical-align: text-bottom;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .username {
        vertical-align: super;
        color: #505050;
      }
      .createDate {
        float: right;
        margin-top: 2vw;
        color: #a1a1a1;
      }
    }
    .momentDesc {
      color: #505050;
      margin-bottom: 6vw;
    }
    .momentPics {
      overflow: hidden;
      border-radius: 3px;
      img {
        /*height: 100%;*/
        width: 100%;
      }
    }
  }
  .iconShare {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAjVBMVEUAAABBQUE/Pz9AQEA/Pz9AQEA+Pj5AQEBAQEA7OztAQEBAQEA/Pz8/Pz8/Pz8+Pj5AQEA/Pz8/Pz8/Pz9DQ0NAQEBAQEA/Pz8/Pz9AQEA/Pz8+Pj5AQEA7OztAQEA/Pz9AQEBAQEBAQEBCQkI+Pj4/Pz8/Pz9AQEBAQEBAQEBAQEBAQEBBQUFBQUFAQECAHCkoAAAALnRSTlMAP3H8dfgkj0oH5vTJwIUStHo5KRquqe2ZaTMcFw3SzKBaUS4Q15RuQyDe24Fi6I2bIgAAAWhJREFUOMuN0umOokAUhuFDH4qdYUdtd+11Zvq9/8trhbTBdKn1/qKSJ+Ergtxp9SxOrRPtli6wAFI/lknt4v+fsauXeRtg413OcWj4yci02E9BdysZywEzRinXLTuF2WJ49pVk0QRj8qvoH2h2npSQNreusw/zmQLoUhpDaFUv75nhUiAePFlYME8BTFqGCehB7LAIDaCZf5S4V9JI7DBKgDQ8T49LmHlih6GCvg1fb51D8ixWGJcKm3qckMHfRqwwzkF38Xjxk3v9FDssAV/GFrBdiR2Gil7ORV4WYofRyVUyzQ6LBDpxgHN4XTvAo6IfNnQMrmEHO5uL0OUUNor5tMEKPqYwhLnYegJvAuMZGrjAg5KLC3yDLyeYYNYusDXk4gIPUDnBCq2d4Es3Fyd46i6sFf8R9M+rWkP/CPaYViRD9/fdHrLhH4K+8m9W9YpGw1TlUe8yFG3NHatmG8lPbe3drG4H8g0P9DoghBQHrQAAAABJRU5ErkJggg==") no-repeat;
    width: 4.5vw;
    height: 4.5vw;
    display: inline-block;
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .van-goods-action {
    padding: 1.5vw 4vw;
    background: #fff;
    border-top: 1px solid #E9E9E9;
    .entrustBtn {
      background: #FF7070;
    }
  }
  .commentSend {
    padding: 0 3vw;
    position: fixed;
    width: 100vw;
    bottom: 0;
    background-color: #fff;
    .van-button--default {
      border: 1px solid #38ACA5;
      color: #38ACA5;
    }
    .van-cell {
      padding: 10px 0;
    }
    [class*=van-hairline]::after {
      border-top: 0 #fff;
    }
  }
  .comments {
    background: #fff;
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
