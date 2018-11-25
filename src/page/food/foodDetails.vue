<template>
  <div style="width: 100vw; height: 100vh;">
    <van-nav-bar
      title="食材详情"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getfoodInfo">
      <van-swipe style="height: 80vw" :autoplay="3000">
        <van-swipe-item v-for="(item, index) in foodInfo.foodPics" :key="item">
          <img v-lazy="item" height="100%" width="100%">
        </van-swipe-item>
      </van-swipe>
      <div class="foodInfo">
        <p class="price">
          <span>¥</span><b>{{foodInfo.price}}</b>
        </p>
        <p class="foodName">
          <b>{{foodInfo.foodName}}</b>
        </p>
        <p class="foodDesc">说明:
          {{foodInfo.foodDesc}}
        </p>
        <div class="foodSpec">
          <span>规格</span>
          <div>{{foodInfo.foodSpec}}</div>
        </div>
      </div>
      <div class="foodComment">
        <p style="font-size: 3vw; padding: 1vw 3vw; color: #505050;">商品评价 ({{foodInfo.commentCount}}条) <span class="praiseRate">好评率<span class="praiseNum">{{foodInfo.praiseRate}}%</span></span></p>
        <div class="comments">
          <van-list
            v-model="loading"
            v-if="comments.length"
            :finished="finished"
            @load="getComments"
          >
            <div class="comment" v-for="(item, index) in comments" :key="index">
              <div class="iconurl">
                <img v-lazy="item.iconurl" width="100%" height="100%">
              </div>
              <div class="commentContent">
                <div class="nickName">{{item.nickName}}<span class="commentDate">{{commentDate(item.commentDate)}}</span>
                </div>
                <div class="commentText">{{item.content}}</div>
              </div>
            </div>
            <div class="noDataList" v-show="!loading"><span>已经到底啦~</span></div>
          </van-list>
          <div class="carNoData" v-else>暂无评论</div>
        </div>
      </div>
    </van-pull-refresh>
    <div style="height: 12vw"></div>
    <div class="van-goods-action">
      <div class="carBtn" @click="openCar">
        <span class="iconCar"><span class="totalNum" v-show="totalNum()">{{totalNum()}}</span></span></div>
      <div class="footerBtn entrustBtn" @click="addCar(foodInfo)">加入菜篮</div>
    </div>
  </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import {mapMutations, mapState} from 'vuex'
  import Function from '@/util/function'

  export default {
    name: "foodDetails",
    data() {
      return {
        comments: [],
        modalShow: false,
        carList: {},
        finished: false,
        loading: false,
        message: '',
        page: 0,
        count: 10,
        videoSrc: '',
        videoShow: false,
        isLoading: false,
        foodInfo: {}
      }
    },
    computed: {
      ...mapState(['foodCar']),
    },
    activated () {
      this.comments = [];
      this.foodInfo = {};
      this.getfoodInfo();
      this.foodCar ? this.carList = this.foodCar : null;
    },
    methods: {
      openCar () {
        this.$router.push({
          path: '/foodCar'
        })
      },
      getComments () {
        axios.post(api.common.commentList, {
          page: this.page + 1,
          count: this.count,
          objType: constant.infoType.food,
          objId: this.$route.query.foodId
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
            objId: this.gardenId,
            actionType: constant.actionType.comment,
            objType: constant.infoType.food,
            content: this.message
          }).then(() => {
            this.message = '';
            this.$toast('发送成功');
            this.getgardenInfo();
          });
        } else {
          this.$toast('不能发送空内容哦');
          this.message = ''
        }
      },
      commentDate (date) {
        return Function.dateFormat(date, 'YYYY-MM-DD H:M')
      },
      ...mapMutations([
        'addToFoodCar', 'reduceFoodToCar'
      ]),
       totalNum () {
        let totalNum = 0;
        if (this.foodCar) {
          for (let item in this.foodCar) {
            totalNum += this.foodCar[item].num
          }
          return totalNum
        }
      },
      addCar (data) {
        this.addToFoodCar(data);
        this.carList = this.foodCar;
      },
      reduceCar (data) {
        this.reduceFoodToCar(data);
        this.carList = this.foodCar;
      },
      onClickLeft() {
        if (!this.$route.query.from) {
          window.history.back()
        } else if (window.app.goBackApp) {
          window.app.goBackApp();
        } else {
          this.$toast('Native错误')
        }
      },
      getfoodInfo() {
        axios.post(api.common.getInfo, {
          objType: constant.infoType.food,
          objId: this.$route.query.foodId
        }).then((res) => {
          this.foodInfo = res.data.data;
          this.page = 0;
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
  .praiseRate {
    float: right;
    color: #A1A1A1;
    .praiseNum {
      color: #F12020;
    }
  }
  .foodComment {
    background-color: #fff;
    margin-top: 1vw;
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
          margin-right: 2vw;
          flex: 1;
        }
      }
    }

  }

  .carNoData {
    height: 20vw;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    font-size: 4vw;
    color: #5e5e5e;
  }
  .itemGoods {
    position: relative;
    height: 15vw;
    display: flex;
    align-items: center;
    padding: 3vw 3vw;
    border-bottom: 1px solid #DFDFDF;
    .itemGoodsName {
      font-size: 4vw;
      font-weight: 600;
    }
  }
  .goodsCar {
    min-height: 50vw;
    max-height: 100vw;
    overflow: auto;
  }
  .iconCar {
    position: relative;
    .totalNum {
      position: absolute;
      top: -1vw;
      right: -2vw;
      font-size: 3vw;
      color: #fff;
      border-radius: 10vw;
      background-color: #DE3B3B;
      padding: 0.4vw 1.3vw;
      min-width: 2vw;
      display: inline-block;
      text-align: center;
    }
  }
  .carBtn {
    padding-right: 3vw;
    border-right: 1px solid #DFDFDF;
    margin-right: 4vw;
    height: 7vw;
    margin-top: 1.5vw;
  }
  .foodInfo {
    background-color: #fff;
    padding: 5vw 3vw;
    .price {
      color: #F12020;
      font-size: 5vw;
      margin-bottom: 2vw;
      span {
        font-size: 3.5vw;
        margin-right: 1vw;
      }
    }
    .foodName {
      font-size: 4vw;
      margin-bottom: 2vw;
      span {
        margin-left: 1vw;
        padding: 0.5vw 2vw;
        font-size: 2.5vw;
        border-radius: 10vw;
        background-color: #FFE7E7;
        color: #F12020;
        display: inline-block;
        vertical-align: text-top;
      }
    }
    .foodDesc {
      color: #505050;
      font-size: 3.5vw;
      padding-bottom: 2vw;
      margin-bottom: 2vw;
      border-bottom: 1px solid #E1E1E1;
    }
    .foodSpec {
      color: #A1A1A1;
      font-size: 3vw;
      div {
        display: inline-block;
        font-size: 3vw;
        padding: 1vw 2.6vw;
        background-color: #E1F6F5;
        border: 1px solid #32A9A1;
        border-radius: 10vw;
        color: #32A9A1;
        margin-left: 3vw;
      }
    }
  }
  .addSeed {
    height: 6vw;
    width: 20vw;
    font-size: 6vw;
    display: flex;
    justify-items: center;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #38ACA5;
    border-radius: 50%;
    position: absolute;
    top: 4vw;
    right: 4vw;
    .seedNum {
      font-size: 3.8vw;
      margin: 0 auto;
      color: #555555;
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
