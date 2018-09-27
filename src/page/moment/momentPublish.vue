<template>
    <div style="height: 100vh;width: 100vw; background-color: #fff">
      <van-nav-bar
        title="发布圈子"
        fixed
        left-arrow
        @click-left="goApp"></van-nav-bar>
      <div style="height: 14vw"></div>
      <van-cell-group>
        <van-cell-group>
          <van-field v-model="momentTitle" placeholder="标题" />
        </van-cell-group>
        <van-field
          v-model="momentDesc"
          type="textarea"
          placeholder="这一刻的想法..."
          rows="1"
          autosize
        />
        <div class="uploaderBox">
          <p style="color: #6c6c6c;margin-bottom: 3vw;">({{momentPics.length}}/9)</p>
          <div class="momentPics">
            <div class="momentPic bounceIn" v-for="item in momentPics">
              <img :src="item.fileUrl">
              <van-icon class="deleteItem" name="clear" @click="deleteItem(item.fileId)"/>
            </div>
            <van-uploader :after-read="onRead" v-if="!(momentPics.length === 9) && !uploadState" accept="image/gif, image/jpeg" multiple :disabled="uploadState">
              <div class="photograph">
                <span class="icon-plus">＋</span>
              </div>
            </van-uploader>
            <div class="uploading" v-else>
            </div>
            <div class="uploadingItem" v-for="item in uploading">
              <div class="uploadingMask"><span>正在上传</span></div>
              <img style="border-radius: 3px" :src="item">
            </div>
          </div>
        </div>
      </van-cell-group>
      <div class="van-goods-action">
        <div class="footerBtn entrustBtn" @click="nextStep">完成</div>
      </div>
    </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  export default {
      name: "momentPublish",
      data() {
        return {
          momentTitle: '',
          momentDesc: '',
          momentPics: [],
          uploadState: false,
          uploading: []
        }
      },
      computed: {
      },
      mounted () {
      },
      activated () {
      },
      methods: {
        checkForm () {
          if (!this.momentTitle) {
            this.$toast('请输入圈子标题');
            return false
          } else if (!this.momentDesc) {
            this.$toast('请输入圈子内容');
            return false
          } else if (!this.momentPics.length) {
            this.$toast('请上传圈子图片');
            return false
          } else {
            return true
          }
        },
        deleteItem (fileId) {
          if (this.momentPics.findIndex(item => item.fileId === fileId) !== -1) {
            this.momentPics.splice(this.momentPics.findIndex(item => item.fileId === fileId), 1)
          }
        },
        uploadImg (file) {
            let formData = new FormData();
            this.uploadState = true;
            this.uploading.push(file.content);
            formData.append('file', file.file);
            axios.post(api.common.uploadFile,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            ).then((res) => {
              this.momentPics.push({
                momentPicId: res.data.data.fileId,
                momentPicUrl: res.data.data.fileUrl
              });
              this.uploadState = false;
              this.uploading = [];
            }).catch(err => {
              this.$toast('上传失败');
              this.uploading = [];
              this.uploadState = false;
            });
        },
        onRead (file) {
          if (this.momentPics.length < 10) {
            if (file.length) {
              if ((file.length + this.momentPics.length) < 10) {
                file.forEach(item => this.uploadImg(item))
              } else {
                this.$toast('最多上传9张照片');
              }
            } else if (file.file) {
              this.uploadImg(file)
            }
          }
        },
        nextStep () {
          if (this.checkForm()) {
            axios.post(api.moment.momentPublish, {
              momentDesc: this.momentDesc,
              momentPics: this.momentPics,
              momentTitle: this.momentTitle
            }).then(() => {
              this.$toast('发送成功');
              this.goApp()
            }).catch(err => {
              this.$toast('发送失败');
              console.log(err);
            })
          }
        },
        goApp () {
          if (window.app) {
            window.app.go2MainPage();
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .deleteItem {
    color: #acacac;
    display: inline-block;
    position: absolute;
    top: -2.5vw;
    right: -2.5vw;
    width: 5vw;
    height: 5vw;
    font-size: 5vw;
  }
  .uploaderBox {
    padding: 4vw 5vw;
    .momentPics {
      display: inline-block;
    }
    .van-uploader {
      vertical-align: top;
    }
    .momentPic, .uploadingItem {
      display: inline-block;
      position: relative;
      width: 25vw;
      height: 25vw;
      margin-right: 5vw;
      margin-bottom: 3vw;
      img {
        width: 100%;
        /*height: 100%;*/
        border-radius: 3px;
      }
      .uploadingMask {
        position: absolute;
        top: 0;
        left: 0;
        width: 25vw;
        height: 25vw;
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        font-size: 3.5vw;
      }
    }
    .photograph {
      width: 25vw;
      height: 25vw;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0.4vw dashed #CACACA;
      border-radius: 3px;
      .icon-plus {
        font-size: 18vw;
        font-weight: 100;
        color: #CACACA;
      }
    }
  }
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
      background: #FF7070;
    }
  }
</style>
