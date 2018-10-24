<template>
  <div style="height: 100vh; width: 100vw;">
    <van-nav-bar
      title="发表评价"
      fixed
      left-arrow
      @click-left="goBack"></van-nav-bar>
    <div style="height: 15vw"></div>
    <div class="foodList" v-if="foodData.length">
      <div v-for="item in foodData" class="foodItem" :key="item.foodId">
        <div class="foodContent">
          <van-cell-group>
            <van-cell>
              <div class="foodPic"><img :src="item.foodPics[0]"></div>
              <div class="foodInfo">
                <p class="foodName">{{item.foodName}}</p>
                <p class="foodSpec">{{item.foodSpec}}</p>
              </div>
            </van-cell>
            <van-cell>
              <van-radio-group v-model="item.favourable" style="display: flex;text-align: center">
                <van-radio name="0" style="flex: 1">好评</van-radio>
                <van-radio name="1" style="flex: 1">中评</van-radio>
                <van-radio name="2" style="flex: 1">差评</van-radio>
              </van-radio-group>
            </van-cell>
          </van-cell-group>
        </div>
        <div class="evaluation">
          <van-cell-group>
            <van-field
              v-model="item.evaluation"
              type="textarea"
              placeholder="食材怎么样,快来评价一下吧~"
              rows="7"
              autosize
            />
          </van-cell-group>
        </div>
      </div>
      <div class="noDataList"><span>已经到底啦~</span></div>
      <div style="height: 14vw;"></div>
    </div>
    <div class="carNoData" v-else>暂无数据</div>
    <div class="van-goods-action" v-if="foodData.length">
      <div class="footerBtn entrustBtn" @click="nextStep">发布</div>
    </div>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config';
  import constant from '@/config/constant';
    export default {
      name: "evaluationFood",
      data () {
        return {
          orderId: this.$route.query.orderId,
          foodData: [],
        }
      },
      mounted () {
        this.getFoods()
      },
      methods: {
        nextStep () {
          let evaluation = [];
          this.foodData.forEach(item => {
            if (item.favourable !== '') {
              evaluation.push({
                actionType: constant.actionType.comment,
                grade: item.favourable,
                content: item.evaluation,
                objId: item.foodId,
                objType: constant.infoType.food
              })
            } else {
              evaluation.push(1)
            }
          });
          if (evaluation.find(item => item === 1)) {
            this.$toast('每份食材至少选择一个评价哦')
          } else {
            let reqAll = [];
            evaluation.forEach(item => {
              reqAll.push(axios.post(api.common.userAction, item))
            });
            axios.all(reqAll).then(axios.spread(() => {
              this.$toast('评价成功');
              this.goBack()
            }))
          }
        },
        getFoods () {
          axios.post(api.my.orderFoodList + this.orderId).then((res) => {
            if (res.data.data.length) {
              res.data.data.forEach(item => {
                item.evaluation = '';
                item.favourable = '';
              });
              this.foodData = res.data.data
            }
          })
        },
        goBack () {
          window.history.back()
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
  .foodItem {
    margin-bottom: 1vw;
    .foodContent {
      .foodPic {
        width: 10vw;
        height: 10vw;
        overflow: hidden;
        line-height: 10vw;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .foodInfo {
        display: inline-block;
        margin-left: 2vw;
        .foodName {
          font-size: 3.8vw;
        }
        .foodSpec {
          color: #a1a1a1;
          font-size: 3vw;
        }
      }
    }
  }
</style>
