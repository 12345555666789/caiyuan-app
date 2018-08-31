<template>
  <div>
    <van-nav-bar
      title="选择菜园"
      fixed
      left-arrow
      @click-left="goBack"></van-nav-bar>
    <div style="height: 12vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="landInfo">
        <div style="display: flex">
          <div class="landText">
            <div class="landTitle">{{landData.landName}}</div>
            <p class="landAddress">
              <van-icon class="dominantHueText" name="location" />
              {{landData.landAddress}}
            </p>
          </div>
          <div class="landPic">
            <img :src="landData.landImg">
          </div>
        </div>
        <div ref="landDesc" class="landDescOpen">{{landData.landDesc}}</div>
        <div id="arrow" v-if="arrowState" @click="openDesc">
          <van-icon name="arrow" style="transform: rotate(90deg)"/>
        </div>
      </div>
    </van-pull-refresh>

    <div v-if="gardenData.length" class="chooseGarden">
        <div  class="serialNum" ref="serialNum">
          <div>
            <div style="height: 4vw"></div>
            <p class="serialNumItem" v-for="(item, index) in gardenData" :key="index">{{item.serialNum}}</p>
          </div>
        </div>
        <div class="gardens" ref="gardens">
          <div class="unit">单位：平米（㎡）</div>
          <div class="gardensSelect">
            <div class="gardensRow" v-for="(gardensRow, index) in gardenData">
              <div v-for="(garden, index) in gardensRow.gardens" :class="garden.gardenStatus === 0 ? 'gardensItem' : garden.gardenStatus === 2 ? 'selectedItem' : 'disableItem'">{{garden.gardenSpec}}</div>
            </div>
          </div>
        </div>
        <div class="gardenExamples">
          <div class="select examples"><span>可选</span></div>
          <div class="disabled examples"><span>不可选</span></div>
          <div class="selected examples"><span>已选</span></div>
        </div>
      </div>
    <div v-else class="notLandRegionData">
      <span>暂无数据</span>
    </div>
    <div class="chooseGardenForm">
      <van-cell-group>
        <van-field
          v-model="gardenForm.landName"
          required
          clearable
          input-align="right"
          label="菜园名称"
          placeholder="请输入菜园名称"
        />
        <van-field
          v-model="gardenForm.startDate"
          required
          clearable
          readonly
          @focus="chooseDate('startDate')"
          input-align="right"
          label="开始日期"
          placeholder="请选择开始日期"
        />
        <van-field
          v-model="gardenForm.endDate"
          required
          clearable
          readonly
          @focus="chooseDate('endDate')"
          input-align="right"
          label="结束日期"
          placeholder="请选择开始日期"
        />
      </van-cell-group>
    </div>
    <div style="height: 14vw"></div>
    <van-popup v-model="dateShow" position="bottom" :overlay="true" click-overlay="cancelDate">
      <van-datetime-picker
        v-model="dateTime"
        type="date"
        :formatter="dateFormatter"
        :title="dateState === 'startDate' ? '开始日期' : '结束日期'"
        @confirm="handleDate"
        @cancel="cancelDate"
      />
    </van-popup>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters} from 'vuex'
  import Function from '@/util/function'
  import { Toast } from 'vant';
  export default {
    name: "chooseGarden",
    data () {
      return {
        dateTime: new Date(),
        dateShow: false,
        arrowState: true,
        isLoading: false,
        dateState: '',
        landId: this.$route.query.landId,
        gardenForm: {
          landName: '',
          startDate: '',
          endDate: ''
        },
        gardenData: [
          {
            serialNum: 1,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 1
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 2
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 1
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 1
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 1
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 1
              }
            ]
          },
          {
            serialNum: 2,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },
          {
            serialNum: 3,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },
          {
            serialNum: 4,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },
          {
            serialNum: 5,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },
          {
            serialNum: 6,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },
          {
            serialNum: 7,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },{
            serialNum: 7,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },{
            serialNum: 7,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },{
            serialNum: 7,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          },{
            serialNum: 7,
            gardens: [
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              },
              {
                gardenSpec: 60,
                gardenId: 78645,
                gardenStatus: 0
              }
            ]
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['landData'])
    },
    mounted () {
      this.getGardenData();
      this.$refs.gardens.addEventListener('scroll', () => {
        this.$refs.serialNum.scrollTop = this.$refs.gardens.scrollTop
      })
    },
    methods: {
      cancelDate () {
        this.dateShow = false
      },
      handleDate (value) {
        let toDay = new Date(new Date().toLocaleDateString()).getTime();
        let setDate = () => {
          if (this.dateState === 'startDate') {
            this.gardenForm.startDate = Function.dateFormat(new Date(value).getTime(), 'YYYY/MM/DD')
          } else {
            this.gardenForm.endDate = Function.dateFormat(new Date(value).getTime(), 'YYYY/MM/DD')
          }
        };
        if (this.gardenForm.startDate && this.gardenForm.endDate) {
          let startDate = new Date(this.gardenForm.startDate).getTime();
          let endDate = new Date(this.gardenForm.endDate).getTime();
          let startFullYear = new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1);
          if (this.dateState === 'startDate') {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('开始日期不得小于今天')
            } else if (new Date(value.toLocaleDateString()).getTime() > endDate) {
              Toast('开始日期不得大于结束日期')
            } else if (endDate < new Date(value).setFullYear(new Date(value).getFullYear() + 1)) {
              Toast('至少选择一年时间')
            } else {
              setDate();
              this.dateShow = false;
            }
          } else {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('结束日期不得小于今天')
            } else if (new Date(value.toLocaleDateString()).getTime() < startDate) {
              Toast('结束日期不得小于开始日期')
            } else if (new Date(value.toLocaleDateString()).getTime() < startFullYear) {
              Toast('至少选择一年时间')
            } else {
              setDate();
              this.dateShow = false;
            }
          }
        } else {
          if (this.dateState === 'startDate') {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('开始日期不得小于今天')
            } else if (this.gardenForm.endDate) {
              let endDate = new Date(this.gardenForm.endDate).getTime();
              if (new Date(value.toLocaleDateString()).getTime() > endDate) {
                Toast('开始日期不得大于结束日期')
              } else if (endDate < new Date(value).setFullYear(new Date(value).getFullYear() + 1)) {
                Toast('至少选择一年时间')
              } else {
                setDate();
                this.dateShow = false;
              }
            } else {
              setDate();
              this.dateShow = false;
            }
          } else {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('结束日期不得小于今天')
            } else if (this.gardenForm.startDate) {
              let startDate = new Date(this.gardenForm.startDate).getTime();
              if (new Date(value.toLocaleDateString()).getTime() < startDate) {
                Toast('结束日期不得小于开始日期')
              } else if (new Date(value.toLocaleDateString()).getTime() < new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1)) {
                Toast('至少选择一年时间')
              } else {
                setDate();
                this.dateShow = false;
              }
            }
          }
        }
      },
      chooseDate (dateState) {
        this.dateState = dateState;
        this.dateTime = this.gardenForm[dateState] ? new Date(this.gardenForm[dateState]) : new Date();
        this.dateShow = true
      },
      dateFormatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
        return value;
      },
      openDesc () {
        this.$refs.landDesc.className = 'landDesc';
        this.arrowState = false
      },
      goBack () {
        window.history.back()
      },
      getGardenData () {
        axios.get(api.garden.getlandDetails + this.landId).then((res) => {
          this.gardenData = res.data.landDetails;
          this.isLoading = false;
        }).catch((err) => {
          this.isLoading = false;
        })
      },
      onRefresh() {
        this.getGardenData()
      }
    },
    destroyed () {
      this.$refs.gardens.removeEventListener('scroll', () => {
        this.$refs.serialNum.scrollTop = this.$refs.gardens.scrollTop
      })
    }
  }
</script>

<style lang="less" scoped>
  .gardenExamples {
    height: 20vw;
    width: 70vw;
    margin: 0 auto;
    text-align: center;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    .select {
      background: url("../../assets/image/selectGarden.png") no-repeat;
    }
    .disabled {
      margin: 0 20vw;
      background: url("../../assets/image/disableGarden.png") no-repeat;
    }
    .selected {
      background: url("../../assets/image/selectedGarden.png") no-repeat;
    }
    .examples {
      width: 8.5vw;
      height: 8.5vw;
      background-size: 100% 100%;
      position: relative;
      span {
        display: inline-block;
        position: absolute;
        color: #505050;
        font-size: 2.8vw;
        text-align: left;
        top: 3vw;
        width: 9vw;
        left: 9vw;
      }
    }
  }
  .chooseGarden {
    margin: 1.5vw 0;
    height: 110vw;
    background: #beebc4;
    position: relative;
    .serialNum {
      background: #E7FFEA;
      border-radius: 3vw;
      width: 4.5vw;
      position: absolute;
      left: 3vw;
      top: 4vw;
      height: 87vw;
      overflow: scroll;
      .serialNumItem {
        text-align: center;
        font-size: 2.8vw;
        margin: 8vw 0;
      }
    }
    .gardens {
      overflow: scroll;
      height: 90vw;
      width: 100vw;
      padding-left: 10vw;
      .unit {
        margin-top: 6vw;
        margin-left: 1vw;
        font-size: 2.8vw;
      }
      .gardensSelect {
        padding-right: 10vw;
        margin-top: 2vw;
        width: max-content;
      }
      .gardensItem {
        display: inline-block;
        text-align: center;
        color: #fff;
        line-height: 9vw;
        margin: 1.3vw;
        width: 8.5vw;
        height: 8.5vw;
        background: url("../../assets/image/selectGarden.png") no-repeat;
        background-size: 100% 100%;
      }
      .disableItem {
        display: inline-block;
        text-align: center;
        color: #9F745A;
        line-height: 9vw;
        margin: 1.3vw;
        width: 8.5vw;
        height: 8.5vw;
        background: url("../../assets/image/disableGarden.png") no-repeat;
        background-size: 100% 100%;
      }
      .selectedItem {
        display: inline-block;
        text-align: center;
        color: #fff;
        line-height: 9vw;
        margin: 1.3vw;
        width: 8.5vw;
        height: 8.5vw;
        background: url("../../assets/image/selectedGarden.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  #arrow {
    text-align: center;
  }
  .landInfo {
    padding: 5vw 3vw;
    background: #ffffff;
    .landDesc {
      margin-top: 4vw;
      font-size: 4vw;
    }
    .landDescOpen {
      margin-top: 4vw;
      font-size: 4vw;
      height: 5vw;
      overflow: hidden;
      -webkit-line-clamp: 5;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    .landText {
      flex: 0.9;
      padding-right: 1vw;
      .landTitle {
        font-size: 4vw;
        font-weight: 700;
        height: 16vw;
        overflow: hidden;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .landAddress {
        color: #7D7D7D;
        font-size: 3.8vw;
        height: 10vw;
        margin-top: 4vw;
        overflow: hidden;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
        .van-icon {
          font-size: 3.8vw;
          vertical-align: text-top;
        }
      }
    }
    .landPic {
      flex: 1.1;
      width: 30vw;
      height: 30vw;
      border-radius: 3px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .notLandRegionData {
    height: 60vw;
    text-align: center;
    color: #505050;
    display: flex;
    align-items: center;
    span {
      font-size: 5vw;
      flex: 1;
    }
  }
</style>
