<template>
  <div>
    <van-nav-bar
      title="菜篮"
      fixed
      left-arrow
      @click-left="onClickLeft"></van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="seedItem" v-for="item in seedData" @click="toSeedInfo(item.seedId)">
        <div class="seedPic">
          <img v-lazy="item.seedPics[0]">
        </div>
        <div class="seedInfo">
          <div class="seedName">{{item.seedName}}</div>
          <div class="seedSpec">{{item.seedSpec}}</div>
          <div class="seedPrice"><span>¥</span>{{item.price}}</div>
          <div class="seedSeason">{{item.season}}</div>
          <div class="addSeed" v-if="carList && carList[item.seedId]">
            <div class="iconReduce"
                 @click.stop="reduceCar(item)"></div>
            <span class="seedNum">{{carList && carList[item.seedId].num}}</span>
            <van-icon name="add" @click.stop="addCar(item)"/>
          </div>
          <div class="seedCount" @click.stop="addCar(item)" v-else>
            <van-icon name="add" />
          </div>
        </div>
      </div>
      <div style="height: 5vw; background-color: #fff"></div>
    </van-pull-refresh>
  </div>
</template>

<script>
    export default {
      name: "foodCar",
      data () {
        return {
          isLoading: false,
          seedData: [],
          carList: {}
        }
      }
    }
</script>

<style scoped lang="less">
  .seedItem {
    background-color: #fff;
    padding-top: 5vw;
    padding-left: 4vw;
    padding-right: 4vw;
    display: flex;
    .seedPic {
      width: 28vw;
      height: 28vw;
      margin-right: 4vw;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .seedInfo {
      height: 28vw;
      width: 60vw;
      overflow: hidden;
      position: relative;
      .seedName {
        margin-bottom: 2vw;
        font-size: 4vw;
        font-weight: 700;
      }
      .seedSpec {
        margin-bottom: 6vw;
        font-size: 2.5vw;
        color: #959595;
      }
      .seedPrice {
        margin-bottom: 1vw;
        color: #F12020;
        font-size: 4vw;
        font-weight: 900;
        span {
          font-size: 3vw;
        }
      }
      .seedSeason {
        display: inline-block;
        padding: 0.5vw 2vw;
        background-color: #E9F2F2;
        color: #38ACA5;
        border-radius: 3vw;
        font-size: 2.5vw;
        text-align: center;
      }
      .seedCount {
        height: 6vw;
        width: 6vw;
        font-size: 6vw;
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #38ACA5;
        border-radius: 50%;
        position: absolute;
        top: 21.5vw;
        right: .1vw;
      }
    }
  }
</style>
