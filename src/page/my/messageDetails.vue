<template>
  <div style="height: 100vh; width: 100vw; background-color: #fff">
    <van-nav-bar
      title="消息详情"
      fixed
      @click-left="goBack"
      left-arrow></van-nav-bar>
    <div style="height: 14vw"></div>
    <van-cell>
      <h3 class="msgTitle">{{msgInfo.title}}</h3>
      <p class="msgDate">{{dateFormat(msgInfo.createDate, 'YYYY-MM-DD')}}</p>
      <p class="msgTxt">{{msgInfo.content}}</p>
    </van-cell>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import Function from '@/util/function'
  import constant from '@/config/constant'

  export default {
      name: "messageList",
      data () {
        return {
          msgInfo: {},
          msgId: this.$route.query.messageId,
          msgStatus: this.$route.query.msgStatus
        }
      },
      mounted () {
        this.getMsgInfo();
        if (this.msgStatus === 1) {
          this.readMsg()
        }
      },
      methods: {
        readMsg () {
          axios.post(api.common.userAction, {
            objType: constant.actionType.view,
            objId: this.msgId
          })
        },
        getMsgInfo () {
          axios.post(api.common.getInfo, {
            objType: constant.infoType.msg,
            objId: this.msgId
          }).then(res => {
            this.msgInfo = res.data.data
          })
        },
        dateFormat (date, format) {
          return Function.dateFormat(date, format)
        },
        goBack () {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  .msgTitle {
    font-weight: 600;
  }
  .msgDate {
    color: #A1A1A1;
    font-size: 3.3vw;
  }
  .msgTxt {
    color: #616161;
    font-size: 4vw;
  }
</style>
