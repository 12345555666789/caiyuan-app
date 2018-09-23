<template>
  <div>
    <van-nav-bar
      title="圈子"
      fixed
      left-arrow
      @click-right="share"
      @click-left="goApp">
      <span class="iconShare" slot="right"></span>
    </van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getmomentInfo">
      <div class="momentInfo">

        <p style="font-size: 3vw; padding: 1vw 3vw">评论 ({{comments.length}})</p>
        <div class="comments">
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
    <div class="commentSend">
      <van-cell-group>
        <van-field
          v-model.trim="message"
          type="textarea"
          placeholder="说说你的想法吧~"
          rows="1"
          autosize
        >
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

  export default {
    name: "momentInfo",
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
        momentId: this.$route.query.momentId,
        momentInfo: {},
        comments: []
      }
    },
    mounted () {
      this.getmomentInfo()
    },
    methods: {
      share () {
        if (window.app.shareInfo) {
          window.app.shareInfo(window.location.href)
        }
      },
      dateFormat (date, format) {
        return Function.dateFormat(date, format)
      },
      getComments () {
        axios.post(api.common.commentList, {
          page: this.page + 1,
          count: this.count,
          objId: this.momentId,
          objType: constant.infoType.moment
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
            objId: this.momentId,
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
      goApp () {
        if (window.app) {
          window.app.go2MainPage();
        }
      },
      getmomentInfo() {
        axios.post(api.common.getInfo, {
          objId: this.momentId,
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
      },
      momentRegion() {
        this.$router.push({
          path: '/momentRegionList'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .iconShare {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAAKlBMVEUAAAAAqPJCQkJCQkI6Ojo/Pz87OzsAqPM/Pz89PT0AqPNAQEA/Pz8AqPPIV01cAAAADXRSTlMA+hcOCRwS9yQp9E41xmi9awAAAXpJREFUOMut1UFKw0AUBuCXGltdBFIQBGGguBcCgruAgtuAFygUXBd6gUIv4hGEHsEjNK2Jbt5dzB9fmnTezGz0X5RMPubNvExCyZU4o1De+CXEzBzQuOGKBnlG+qE58TUjg4IRRqkMcpbsjp40I9neOWumO4wXuCqOnJ70xlziAjBFru3muG63UZLKmWFkS8mgqOrlgKVtjARRPVe1c+570ZwIYXVS/PSLN2N0qvgShltzTFZsoFdEI0xWnENXhMm4b/EImkpvH4rXeBSyRkU2T9pdyeSZ4nl3iktMtjluS0vtTDFOvrs6kOJGP+U8OVOM/TxSF8UFTsjLqL3xM2qTnxNd+15Yep3ZL8a2Z13byLsmS9eKK3C/tM17cHccqwBjaT/HzF8BnmBpL2PjqZ+x8UWA35kpwCbMzGWYd3/iNMQFfn2M/D/XeLt9jC8uYd8/wxjNRsx7Ny/bZvHJTx0xDcg370nV8IWfNxSa/i39ObF/Hg+3jrxCfgDP98q+07po5wAAAABJRU5ErkJggg==") no-repeat;
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
