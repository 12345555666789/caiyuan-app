<template>
    <div style="height: 100vh; width: 100vw;background-color: #fff">
      <van-nav-bar
        title="投诉与建议"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 15vw"></div>
      <van-cell>
        <h4 style="font-weight: 600;margin-bottom: 5vw">标题</h4>
        <van-field style="background-color: rgb(251, 251, 251);
    border: 1px solid #E4E4E4;
    border-radius: 3px;" v-model="value" placeholder="请输入您要反馈的问题类型" />
        <h4 style="font-weight: 600;margin-bottom: 5vw;margin-top: 5vw">请留下您的建议或意见,我们会尽快解决~</h4>
        <van-field
          v-model="message"
          style="background-color: rgb(251, 251, 251);
    border: 1px solid #E4E4E4;
    border-radius: 3px;"
          type="textarea"
          placeholder="请输入您的意见或建议"
          rows="8"
          autosize
        />
      </van-cell>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">确定</div>
      </div>
    </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import Function from '@/util/function'
    export default {
      name: "suggestion",
      data () {
        return {
          message: '',
          value: ''
        }
      },
      methods: {
        nextStep () {
          if (this.message && this.value) {
            axios.post(api.help.complainPublish, {
              "content": this.message,
              "msgType": 1,
              "title": this.value
            }).then(res => {
              this.$toast('提交成功,我们会在收到您的反馈第一时间做出处理');
              this.message = '';
              this.value = '';
              window.history.back()
            })
          } else {
            this.$toast('请输入标题以及您遇到的问题或想提出的建议')
          }
        },
        onClickLeft () {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  .van-goods-action {
    padding: 1.5vw 4vw;
    background: #fff;
    border-top: 1px solid #E9E9E9;
    text-align: center;
    justify-content: center;
    justify-items: center;
    .footerBtn {
      width: 90vw;
      height: 9vw;
      line-height: 9vw;
      border-radius: 5vw;
      color: #fff;
    }
    .entrustBtn {
      background: #38ACA5;
    }
  }
</style>
