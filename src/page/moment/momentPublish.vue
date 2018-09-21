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
            <div class="momentPic" v-for="item in momentPics">
              <img :src="item.momentPicUrl">
              <span class="deleteItem"></span>
            </div>
          </div>
          <van-uploader :after-read="onRead" v-if="!(momentPics.length === 9)" accept="image/gif, image/jpeg" multiple>
            <div class="photograph">
              <span class="icon-plus">＋</span>
            </div>
          </van-uploader>
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
          momentPics: []
        }
      },
      computed: {
      },
      mounted () {
      },
      activated () {
      },
      methods: {
        uploadImg (file) {
          console.log(file);
          axios.post(api.common.uploadFile, {

          })
        },
        onRead (file) {
          if (file.length) {
            file.forEach(item => this.uploadImg(item))
          } else if (file.file) {
            this.uploadImg(file)
          }
        },
        nextStep () {

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
  .uploaderBox {
    padding: 4vw 5vw;
    .momentPic {
      width: 25vw;
      height: 25vw;
      margin-right: 8vw;
      border-radius: 3px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
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
