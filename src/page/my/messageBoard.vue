<template>
    <div style="width: 100vw; height: 100vh">
      <van-nav-bar
        title="留言板"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 14vw"></div>
      <van-list>
        <div class="msgItem" v-for="item in messageList" :key="item.msgId">
          <p class="createDate"><span>{{commentDate(item.createDate)}}</span></p>
          <div class="userContent" v-if="item.owner === 1">
            <div class="userMsg">
              <div class="msgContent">
                <!--<p style="color: #53B2AC; font-size: 3.5vw; margin-bottom: 1vw;padding-bottom: 1vw;border-bottom: 1px solid #D5D5D5">{{item.msgType === 1 ? "要求更新菜园视频或图片" : item.msgType === 2 ? "预约采摘" : '其他'}}-->
                <!--</p>-->
                {{item.content}}
              </div>
              <span class="rightArrow"><span></span></span>
            </div>
            <div class="userPic"><img v-lazy="userInfo && userInfo.iconurl"></div>
          </div>
          <div class="systemContent" v-else>
            <div class="systemPic"></div>
            <div class="systemMsg">
              <span class="leftArrow"><span></span></span>
              <div class="msgContent">
                <p style="color: #53B2AC; font-size: 3.5vw; margin-bottom: 1vw;padding-bottom: 1vw;border-bottom: 1px solid #D5D5D5">系统回复</p>
                {{item.content}}
              </div>
            </div>
          </div>
        </div>
        <div id="scrollInToView" style="height: 30vh"></div>
      </van-list>
      <div style="height: 30vw"></div>
      <div class="commentSend">
        <van-cell-group>
          <van-cell class="msgTypes">
            <span style="font-size: 3.5vw;color: #686868;margin-right: 3vw;">我想</span>
            <span class="msgType" ref="update" @click="handleMsgType(1, '更新菜园视频或图片')">要求更新菜园视频或图片</span>
            <span class="msgType" ref="pick" @click="handleMsgType(2, '预约采摘')">预约采摘</span>
            <span class="msgType" ref="other" @click="handleMsgType(3)">其他</span>
          </van-cell>
          <van-field
            v-model.trim="message"
            type="textarea"
            placeholder="留言给我们吧~"
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
  import Function from '@/util/function'
  import {mapState, mapMutations} from 'vuex'
    export default {
      name: "messageBoard",
      data () {
        return {
          message: '',
          landId: this.$route.query.landId,
          msgType: '',
          messageList: []
        }
      },
      computed: {
        ...mapState(['userInfo', 'userAction'])
      },
      watch: {
        'messageList.length' () {
          setTimeout(() => {
            document.getElementById('scrollInToView').scrollIntoView()
          })
        }
      },
      mounted () {
        this.getUserInfo();
        this.getMessageList();
      },
      methods: {
        ...mapMutations(['setUserAction', 'setUserInfo']),
        handleMsgType (type, msg) {
          this.message = msg || '';
          if (this.msgType !== type) {
            this.msgType = type;
            if (type === 1) {
              this.$refs.update.className = 'msgType-active';
              this.$refs.pick.className = 'msgType';
              this.$refs.other.className = 'msgType';
            } else if (type === 2) {
              this.$refs.update.className = 'msgType';
              this.$refs.pick.className = 'msgType-active';
              this.$refs.other.className = 'msgType';
            } else {
              this.$refs.update.className = 'msgType';
              this.$refs.pick.className = 'msgType';
              this.$refs.other.className = 'msgType-active';
            }
          }
        },
        commentDate (date) {
          return Function.dateFormat(date, 'YYYY-MM-DD H:M')
        },
        sendComment () {
          this.message = this.message.replace(/\s/g, "");
          if (this.msgType) {
            if (this.message) {
              axios.post(api.help.msgPublish, {
                "content": this.message,
                "landId": this.landId,
                "msgType": this.msgType
              }).then(() => {
                this.message = '';
                this.$toast('发送成功');
                this.getMessageList();
              }).catch(err => {
                console.log(err);
                this.$toast('发送失败');
              });
            } else {
              this.$toast('不能发送空内容哦');
              this.message = ''
            }
          } else {
            this.$toast('请在‘我想’选择您的留言类型');
          }
        },
        getMessageList () {
          axios.post(api.help.msgList + this.landId).then(res => {
            if (res.data.data.length) {
              this.messageList = res.data.data;
            }
          })
        },
        getUserInfo () {
          axios.post(api.my.userInfo).then(res => {
            this.setUserInfo(res.data.data);
          })
        },
        onClickLeft() {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  .msgItem {
    padding: 3vw;
    .createDate {
      text-align: center;
      margin-bottom: 2vw;
      span {
        padding: 1vw 3vw;
        font-size: 3vw;
        color: #fff;
        display: inline-block;
        background: #D4D4D4;
        border-radius: 6vw;
      }
    }
    .systemContent {
      .systemPic {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAbFBMVEUAAADqAHPZGnzUInrYHnrXH3nUInnWIHrUInrUInnUInnUInnUInrVIXnVIXnUInnVInnUInrUInnVInnVIXnUInnUInnUInnVIXrUInrVIHnTInnVIHjUInrUI3rVInrUInrVIXnVH3zUI3oq+g8jAAAAI3RSTlMAAwv4ER2hOfCx47uYdkjGf+qMWVX0021Oqiv8QNrNYGYzJFihcpcAAAPfSURBVHja7dwHsqMwDAZggek1hADp7b//HbdltiT7QnNAZvTdwINsjAokhBBCCCGEEEIIIYQQBrD2x++2q++a8ni3yECW33hnhX+o2ru4ZBL7sgvwhXxjyoOxy1DhnVNJBrBXAVrlN2LOTgN0cVjxjq8sQlc5413veOgh2hNTtwK9BEdiaaPQk8qIoRT9HTbEzgpDKJ+YuWCY4E6sbDFUzep94gQYbE2MhBiB0TYpMcaZTXA5AUa5EhMexilsYsHHWCtiIcZYgUMM7DFeSgwkGK9gcHDZChowuDxeoENOs4uhxezJCAd6eDSzK/QILJrXDppsaVZWhWXElg8sI7auwDJiKwGWEVs5tIloTgr6uNQTw9fhTxfqhemhNfMm2QDL2CQNdHJoNis8MzTBtca/jE0LeXhlZPI0hE4x9cH1xT7vsXWCVhbNpQCWcf4G0GpPc6mwkBfJAVplNBf8ZP5Hor2UhThYSGg50OtIXTEPrT3NxAKARXy1A1jGFaUClnFpjPBgerXnjIWkUWLo1FB//FK/8yYfUmikLOqLQb/Zf4Q0HxdYRDZI6/mrHOqPXy10aGTx6J1j1MVhK2gS2DQQs1xjQj1xja09zcuujL8wPiRL2Oo/3A/Q4ETzS4xOBOlqX36oiYPNAvrnfkkNrrlprYlGTFrKv2tqhWGieH1lNZBouVmzDk8HdHU4hevLjc+zeGLdswbt4s3eIvaUMeMJLaqlLIR3Kq4715CrVasN7wJCd7Exky/v+cZMvrxnnwy7Xn3BytlXcDuxY8OH8h/uNbo7NGz3yaZCL+c9ceTu0NuO31Jc74AhwoxTgNmbEIMVic9jLU65qzBOkcz9XOxsfYYWwa60aSbOJVTQ6BA3Lk3OKkMF/fLUoSm5qwIfojyfpuLs8FGhQ5PYFviwIqPPsz18xajBBSvGJDyLvsRwYqRvcZRVCYFFr5AdoJURYzEpumH/94QaLQw5uRxM6UyvOPaZtbPpL+Zukddzi02tkM84dYgWpuz2M9oZ0dAcoY0hr0SFHhg3dljowoDpBQfTKugJy3blDgL6xfiFVPSL8QtZTGhF9JvZp1ZNr1hOfQ95IbL8oUCv/IPJl8aUnjD9n0vPCra5X4jKpv/jN2T83o5eMJ07fE/d6XMyTKb26ZO2NSaRH+nT7s2uwEdVcbqnSVi31DtX+IQoTKeuulv7S5IHWtewylyai+Nfk1xhnCpPmiOH/3tb9yxN8gJ9qVOcpKXv8ujg+MP2yzQJ6wptDlHsrRgu4Jlzy8pruk528TkK8KCKqM5Db9WUR/YLEEIIIYQQQgghhBBCCCGEEJP5BkJymNHbFkDlAAAAAElFTkSuQmCC") no-repeat;
        background-size: 100% 100%;
        width: 12vw;
        height: 12vw;
        display: inline-block;
        background-color: #fff;
        border-radius: 50%;
        vertical-align: top;
      }
      .systemMsg {
        display: inline-block;
        .leftArrow {
          width: 0;
          height: 0;
          border-width: 2vw 2vw 2vw 0;
          border-style: solid;
          border-color: transparent #D5D5D5 transparent transparent;
          position: relative;
          display: inline-block;
          margin-right: -1.5vw;
          margin-top: 2.5vw;
          span {
            display: block;
            width: 0;
            height: 0;
            border-width: 1.9vw 1.9vw 1.9vw 0;
            border-style: solid;
            border-color: transparent #fff transparent transparent;
            position: absolute;
            top: -1.85vw;
            left: 0.1vw;
          }
        }
        .msgContent {
          display: inline-block;
          padding: 2vw 3vw;
          background: #fff;
          border: solid 1px #D5D5D5;
          color: #5d5d5d;
          font-size: 3.8vw;
          max-width: 59vw;
          vertical-align: top;
          border-radius: 3px;
        }
      }
    }
    .userContent {
      text-align: right;
      .userPic {
        width: 12vw;
        height: 12vw;
        display: inline-block;
        background-color: #fff;
        border-radius: 50%;
        vertical-align: top;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .userMsg {
        display: inline-block;
        text-align: left;
        .rightArrow {
          width: 0;
          height: 0;
          border-width: 2vw 0 2vw 2vw;
          border-style: solid;
          border-color: transparent transparent transparent #D5D5D5;
          position: relative;
          display: inline-block;
          margin-left: -1.5vw;
          margin-top: 2.5vw;
          span {
            display: block;
            width: 0;
            height: 0;
            border-width: 1.9vw 0 1.9vw 1.9vw;
            border-style: solid;
            border-color: transparent transparent transparent #fff;
            position: absolute;
            top: -1.9vw;
            right: 0.2vw;
          }
        }

        .msgContent {
          display: inline-block;
          padding: 2vw 3vw;
          background: #fff;
          border: solid 1px #D5D5D5;
          color: #5d5d5d;
          font-size: 3.8vw;
          max-width: 59vw;
          vertical-align: top;
          border-radius: 3px;
        }
      }
    }
  }
  .msgType {
    background: #fff;
    border: 1px solid #53B2AC;
    color: #53B2AC;
    border-radius: 3vw;
    padding: .7vw 2vw;
    font-size: 3.5vw;
    margin-right: 3vw;
  }
  .msgType-active {
    background: #53B2AC;
    border: 1px solid #53B2AC;
    color: #fff;
    border-radius: 3vw;
    padding: .7vw 2vw;
    font-size: 3.5vw;
    margin-right: 3vw;
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
      height: 15vw;
    }
    [class*=van-hairline]::after {
      border-top: 0 #fff;
    }
  }

</style>
