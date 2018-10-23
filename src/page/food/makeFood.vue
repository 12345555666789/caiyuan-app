<template>
    <div style="height: 100vh; background: #fff">
      <van-nav-bar
        title="预约美食"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="foodTypes">
          <div class="typeItem" v-for="item in foodTypes" @click="toChooseFood(item.typeId)">
            <div class="typeContent">
              <p>{{item.typeName}}</p>
              <span>查看  <van-icon name="arrow" /></span>
            </div>
            <div class="typePic">
              <img :src="item.typePic">
            </div>
          </div>
        </div>
      </van-pull-refresh>
      <div class="carBtn" @click="openCar">
        <span class="iconCar"><span class="totalNum" v-show="totalNum()">{{totalNum()}}</span></span>
      </div>
    </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters, mapMutations, mapState } from 'vuex'

  export default {
      name: "makeFood",
      data () {
        return {
          carList: {},
          isLoading: false,
          token: null,
          foodTypes: []
        }
      },
      computed: {
        ...mapState(['foodCar'])
      },
      mounted () {
        try {
          this.token = window.app.getToken();
        } catch (e) {
          this.$toast('获取token失败');
        }
        this.foodCar ? this.carList = this.foodCar : null;
        this.getFoodTypes();
      },
      activated () {
        try {
          this.token = window.app.getToken();
        } catch (e) {
          this.$toast('获取token失败');
        }
        this.foodCar ? this.carList = this.foodCar : null;
      },
      methods: {
        openCar () {
          this.$router.push({
            path: '/foodCar'
          })
        },
        totalNum () {
          let totalNum = 0;
          if (this.carList) {
            for (let item in this.carList) {
              totalNum += this.carList[item].num
            }
            return totalNum
          }
        },
        toChooseFood (typeId) {
          this.$router.push({
            path: '/chooseFood',
            query: {
              foodType: typeId
            }
          })
        },
        getFoodTypes () {
          axios.post(api.food.getFoodTypes).then(res => {
            this.foodTypes = res.data.data;
            this.isLoading = false;
          }).catch(() => {
            this.isLoading = false;
          })
        },
        onRefresh() {
          this.getFoodTypes()
        },
        onClickLeft () {
          if (this.$route.query.from) {
            window.history.back()
          } else if (window.app.goBackApp) {
            window.app.goBackApp();
          } else {
            this.$toast('Native错误')
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .iconCar {
    height: 15vw;
    width: 15vw;
    background: url("data:image/png;base64,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") no-repeat;
    background-size: 100% 100%;
    .totalNum {
      position: absolute;
      top: 1vw;
      right: 1vw;
      font-size: 3vw;
      color: #fff;
      border-radius: 13vw;
      background-color: #DE3B3B;
      padding: 0.8vw 1.8vw;
      min-width: 2vw;
      display: inline-block;
      text-align: center;
    }
  }
  .carBtn {
    border-radius: 50%;
    position: fixed;
    bottom: 4vw;
    right: 6vw;
    z-index: 9;
  }
.foodTypes {
  padding: 16vw 0;
  overflow: hidden;
  .typeItem {
    display: inline-block;
    border: 1px #ECECEC solid;
    width: 44vw;
    height: 28vw;
    margin-right: 3vw;
    margin-left: 3vw;
    margin-bottom: 3.5vw;
    border-radius: 2px;
  }
  .typeContent {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    height: 100%;
    padding-top: 8vw;
    p {
      margin-left: 3vw;
      margin-bottom: 3vw;
      font-weight: 600;
      font-size: 3.5vw;
    }
    span {
      margin-left: 3vw;
      font-size: 3.3vw;
      color: #6B6B6B;
      i {
        vertical-align: text-top;
      }
    }
  }
  .typePic {
    display: inline-block;
    width: 45%;
    height: 27vw;
    img {
      width: 93%;
      height: 74%;
      margin-top: 20%;
      border-radius: 5px;
    }
  }
}
</style>
