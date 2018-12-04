<template>
  <div style="height: 100vh; width: 100vw">
    <van-nav-bar
      title="消息"
      fixed
      @click-left="goApp"
      left-arrow></van-nav-bar>
    <div style="height: 14vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-if="msgList.length"
        v-model="loading"
        @load="getMsgList"
        :finished="finished">
        <van-cell class="msgItem" v-for="item in msgList" :key="item.messageId" @click="toMsgInfo(item.messageId, item.status)">
          <div :class="item.messageType === 2 ? 'activityIcon' : 'sysIcon'"><span v-if="item.status === 1" class="msgStatus"></span></div>
          <div class="msgContent">
            <div class="msgTitle"><span class="ellipse" style="display: inline-block; max-width: 55vw">{{item.title}}</span><span class="msgDate">{{dateFormat(item.createDate, 'YYYY-MM-DD H:M')}}</span></div>
            <div class="msgTxt ellipse">{{item.content}}</div>
          </div>
        </van-cell>
        <div class="noDataList" v-show="!loading"><span>已经到底啦~</span></div>
      </van-list>
      <div class="carNoData" v-else>暂无数据</div>
    </van-pull-refresh>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import Function from '@/util/function'
    export default {
      name: "messageList",
      data () {
        return {
          msgList: [],
          finished: false,
          loading: false,
          isLoading: false,
          page: 0,
          count: 10,
        }
      },
      activated () {
        this.page = 0;
        this.msgList = [];
        this.getMsgList();
      },
      methods: {
        toMsgInfo (msgId, msgStatus) {
          this.$router.push({
            path: '/messageDetails',
            query: {
              messageId: msgId,
              msgStatus
            }
          })
        },
        dateFormat (date, format) {
          return Function.dateFormat(date, format)
        },
        onRefresh () {
          this.page = 0;
          this.msgList = [];
          this.getMsgList();
        },
        getMsgList () {
          axios.post(api.msg.msgList, {
            "count": this.count,
            "page": this.page + 1,
          }).then((res) => {
            this.page += 1;
            this.loading = false;
            this.isLoading = false;
            if (res.data.data.length) {
              this.msgList.push(...res.data.data)
            } else {
              this.finished = true
            }
          })
        },
        goApp () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          } else {
            this.$toast('Native错误');
          }
        },
      }
    }
</script>

<style scoped lang="less">
  .carNoData {
    height: 20vw;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    font-size: 4vw;
    color: #5e5e5e;
  }
  .sysIcon {
    display: inline-block;
    width: 6vw;
    height: 6vw;
    position: relative;
    vertical-align: top;
    margin-right: 1vw;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAXVBMVEUAAABxvOhwvelwvelwvOpxvOlxvehxvehxvOhwvOhwu+hwvOh1vel4wPFxvOlxvOj///+g0u+r1/H4/P7o9PuWzu7h8frK5vaCxOt8wurX7PjA4fSe0e+63vOOyeyIQlmUAAAAD3RSTlMA94VVR/Hr19C6sagjCpVzxlHTAAABEUlEQVQ4y5WV626DMAxGEwgEAqk9wrXt9v6PuYvUDjsB4vPTOrIsPmIrhjeFs7XWtXWF8eoM02nYoTtzqJYNRDRlUu1bSNL2ibYVHFBFzQs4oaDuDU655fblvUu45D13X13L1eubtJBBezTEFJajQeLcFsRElr+u4dX1ERDvz8g2P3LHakPAP+4bUDqlvGYuvpiZrD2fYg345pPPwcN74D8hitHRwog7JiA4ZWkh7OUBCFbVtIAncq10vqxFsmwMmy9b5fJlR0NZByIvEwvF0EgYE43b61xZe/qLbs8Pwhf7RZWBTEzyWQ3jOMduk36w2xyGWC4lq0C0ZKTrS74Yr1eudJnLz8T1ARKfNvnRFJ3jb6xUWZ4UVJSNAAAAAElFTkSuQmCC") no-repeat;
    background-size: 100% 100%;
  }
  .activityIcon {
    display: inline-block;
    width: 6vw;
    height: 6vw;
    position: relative;
    vertical-align: top;
    margin-right: 1vw;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAeFBMVEUAAAD2fHz2fHz0fX31fHz1fX32fX31fHz1fX31fHz0fHz2fX32fHz4fHzodHT2fX3/gID1fHz////++/v5tbX4sLD71tb2l5f1goL+8/P70dH2ior97u796Oj84eH6zMz6x8f6wsL2j4/82dn5u7v4q6v3pKT3oKB/Ry2aAAAAEXRSTlMA94VH8evX0LqxqFhSIwuVCiAcQoQAAAFQSURBVDjLnZXploIwDIVbNtklLYuAiI7b+7/hzDCjtEmlB76f6aUn5KYJQxSuEwU+534QOW7BlnBjDgo8dj9K0x0QdqlRmoVgJMyoNvHgA16CtQ4s4OjaPSyyN99rvzsBK++8M88u9l41QTUzE/57AYRnSWN/7lDfDkfZUy+nfgDCRYiaRn/7JCbRLymEeJBwzFjOSfQkfjgecJjnhiwqMXE25OGgFKpOiglZlw22MdKErdBotQ8iFmhFoFzn84D5MFNT7aD8p8+4asaAta1qDtfE0KOcZQOa2AeVRmriO6j4LDAW2VjqgEV64KGKUe9F2JS7Kr4gU7DdpSoekd24kW6zFPcpL3CLnqeOK6up8064RVEenZDdcyriKMWAssDParz1bz+rK3lW9MGaSdeMglVDZs342jYY7SN32zC3r4lNC8i+2rYtTUquruMcHX4DGBJmv+02h5MAAAAASUVORK5CYII=") no-repeat;
    background-size: 100% 100%;
  }
  .msgStatus {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    width: 1.5vw;
    height: 1.5vw;
    background-color: #E32C2C;
    border-radius: 50%;
  }
  .msgContent {
    display: inline-block;
    .msgTitle {
      font-size: 4vw;
      width: 83vw;
      font-weight: 600;
      .msgDate {
        font-weight: 500;
        color: #A1A1A1;
        float: right;
        font-size: 3.3vw;
      }
    }
    .msgTxt {
      color: #616161;
      font-size: 3.5vw;
      width: 80vw;
    }
  }
</style>
