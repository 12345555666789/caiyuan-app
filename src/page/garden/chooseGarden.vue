<template>
  <div style="height: 100vh; width: 100vw;">
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
            <div class="landTitle">{{landData.farmName}}({{landData.farmGradeName}}:{{landData.geologicalTypeName}})</div>
            <div style="height: 10vw; margin-top: 4vw;">
              <p class="landAddress" v-if="landData.address">
                <van-icon class="dominantHueText" name="location" />
                {{landData.address}}
              </p>
            </div>
          </div>
          <div class="landPic">
            <img :src="landData.farmPics && landData.farmPics[0]">
          </div>
        </div>
        <div ref="landDesc" v-if="landData.farmDesc" class="landDescOpen">{{landData.farmDesc}}</div>
        <div id="arrow" v-if="arrowState && landData.farmDesc" @click="openDesc">
          <van-icon name="arrow" style="transform: rotate(90deg)"/>
        </div>
      </div>
    </van-pull-refresh>

    <div v-if="gardenData.length" class="chooseGarden">
        <div  class="row" ref="row">
          <div>
            <div style="height: 4vw"></div>
            <p class="rowItem" v-for="(item, index) in gardenData" :key="index">{{item.row}}</p>
          </div>
        </div>
        <div class="lands" ref="lands">
          <div class="unit">单位：平米（㎡）</div>
          <div class="landsSelect">
            <div class="landsRow" v-for="(landsRow, index) in gardenData" :key="'' + landsRow.row + index">
              <div v-for="(garden, index) in landsRow.lands"
                   :key="garden.landId"
                   :class="garden.landStatus === 1 ? 'landsItem' : garden.landStatus === 4 ? 'selectedItem' : 'disableItem'"
                   @click="handleLand(garden, landsRow.row)">{{garden.landSize}}</div>
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
          clearable
          input-align="right"
          label="菜园名称"
          placeholder="请输入菜园名称"
        />
      </van-cell-group>
      <van-cell-group>
      <van-field
          v-model="gardenForm.startDate"
          clearable
          readonly
          @focus="chooseDate('startDate')"
          input-align="right"
          label="开始时间"
          placeholder="请选择开始时间"
        />
      </van-cell-group>
      <van-cell-group>
      <van-field
          v-model="gardenForm.endDate"
          clearable
          readonly
          @focus="chooseDate('endDate')"
          input-align="right"
          label="到期时间"
          placeholder="请选择到期时间"
        />
      </van-cell-group>
    </div>
    <div style="height: 26vw"></div>
    <div v-if="selectedGarden.length" class="van-goods-action" style="text-align: left;bottom: 5vw">
      <div class="chooseGardenForm">
      <div class="selectedBox">
        <div class="selectedLand animated bounceIn" v-for="(item, index) in selectedGarden" :key="'' + item.row + item.col">
          <span>{{item.row}}排{{item.col}}号{{item.landSize}}㎡</span>
          <van-icon @click="deleteItem(item)" name="clear" />
        </div>
      </div>
      <!--<div v-else class="notLandRegionData" style="height: 20vw;">-->
        <!--<span style="font-size: 4vw">请选择菜园</span>-->
      <!--</div>-->
    </div>
    </div>
    <div class="van-goods-action">
      <div class="footerBtn entrustBtn" @click="nextStep(1)">托管开垦</div>
      <div class="footerBtn autonomyBtn" @click="nextStep(2)">自理开垦</div>
    </div>
    <van-popup v-model="dateShow" position="bottom" :overlay="true" click-overlay="cancelDate">
      <van-datetime-picker
        v-model="dateTime"
        type="date"
        :formatter="dateFormatter"
        :title="dateState === 'startDate' ? '开始时间' : '到期时间'"
        @confirm="handleDate"
        @cancel="cancelDate"
      />
    </van-popup>
  </div>
</template>

<script>
  import api from '@/config/api';
  import constant from '@/config/constant'
  import axios from '@/config/axios.config'
  import {mapActions, mapGetters} from 'vuex'
  import Function from '@/util/function'
  import { Toast } from 'vant';
  export default {
    name: "chooseGarden",
    data () {
      return {
        recMod: 0,
        selectedGarden: [],
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
        gardenData: []
      }
    },
    computed: {
      ...mapGetters(['landData', 'gardenOrder'])
    },
    activated () {
      this.gardenOrder && this.gardenOrder.landInfo ? this.setLandData() : null;
      this.getGardenData();
      setTimeout(() => {
        this.$refs.lands.addEventListener('scroll', () => {
          this.$refs.row.scrollTop = this.$refs.lands.scrollTop
        })
      }, 500)
    },
    methods: {
      setLandData () {
        // TODO 从Vuex中读取以选择菜园信息
        // this.gardenForm.startDate = this.gardenOrder.landInfo.startDate || '';
        // this.gardenForm.endDate = this.gardenOrder.landInfo.endDate || '';
        this.gardenForm.landName = this.gardenOrder.landInfo.landName || '';
        this.recMode = this.gardenOrder.landInfo.recMode || 0;
      },
      ...mapActions(['setSelectedLands']),
      checkForm () {
        if (this.selectedGarden.length) {
          if (this.gardenForm.landName) {
            if (this.gardenForm.startDate && this.gardenForm.endDate) {
              return true
            } else {
              Toast('请选择时间范围');
              return false
            }
          } else {
            Toast('请填写菜园名称');
            return false
          }
        } else {
          Toast('请选择菜园');
          return false
        }
      },
      setLands () {
        this.setSelectedLands({
          landName: this.gardenForm.landName,
          startDate: this.gardenForm.startDate,
          endDate: this.gardenForm.endDate,
          recMode: this.recMod,
          lands: this.selectedGarden
        });
      },
      nextStep (recMod) {
        if (this.checkForm()) {
          this.recMod = recMod;
          this.setLands();
          this.$router.push({
            path: '/chooseSeed',
            query: {recMod}
          })
        }
      },
      deleteItem (land) {
        this.selectedGarden.splice(this.selectedGarden.findIndex(item => item.landId === land.landId), 1);
        this.gardenData.forEach(item => {
          item.lands.forEach(item => {
            item.landId === land.landId ? item.landStatus = 1 : null
          })
        })
      },
      handleLand (land, row) {
        if (land.landStatus === 1) {
          if (this.selectedGarden.length < constant.orderLandMax) {
            land.landStatus = 4;
            this.selectedGarden.unshift({
              ...land,
              row
            });
          } else {
            this.$toast('最多选择'+ constant.orderLandMax +'块菜园哦')
          }
        } else if (land.landStatus === 4) {
          land.landStatus = 1;
          if (this.selectedGarden.findIndex(item => item.landId === land.landId) !== -1) {
            this.selectedGarden.splice(this.selectedGarden.findIndex(item => item.landId === land.landId), 1)
          }
        }
      },
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
          let startFullYear = new Date(startDate).setFullYear(new Date(startDate).getFullYear() + constant.landYearsMin);
          let startMaxYear = new Date(startDate).setFullYear(new Date(startDate).getFullYear() + constant.landYearsMax);
          if (this.dateState === 'startDate') {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('开始时间不得小于今天')
            } else if (new Date(value.toLocaleDateString()).getTime() > endDate) {
              Toast('开始时间不得大于到期时间')
            } else if (endDate < new Date(value).setFullYear(new Date(value).getFullYear() + constant.landYearsMin)) {
              Toast('至少选择' + constant.landYearsMin + '年时间')
            } else if (endDate > new Date(value).setFullYear(new Date(value).getFullYear() + constant.landYearsMax)) {
              Toast('最多选择' + constant.landYearsMax + '年时间')
            } else {
              setDate();
              this.dateShow = false;
            }
          } else {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('到期时间不得小于今天')
            } else if (new Date(value.toLocaleDateString()).getTime() < startDate) {
              Toast('到期时间不得小于开始时间')
            } else if (new Date(value.toLocaleDateString()).getTime() < startFullYear) {
              Toast('至少选择' + constant.landYearsMin + '年时间')
            } else if (new Date(value.toLocaleDateString()).getTime() > startMaxYear) {
              Toast('最多选择' + constant.landYearsMax + '年时间')
            } else {
              setDate();
              this.dateShow = false;
            }
          }
        } else {
          if (this.dateState === 'startDate') {
            if (new Date(value.toLocaleDateString()).getTime() < toDay) {
              Toast('开始时间不得小于今天')
            } else if (this.gardenForm.endDate) {
              let endDate = new Date(this.gardenForm.endDate).getTime();
              if (new Date(value.toLocaleDateString()).getTime() > endDate) {
                Toast('开始时间不得大于到期时间')
              } else if (endDate < new Date(value).setFullYear(new Date(value).getFullYear() + constant.landYearsMin)) {
                Toast('至少选择' + constant.landYearsMin + '年时间')
              } else if (endDate > new Date(value).setFullYear(new Date(value).getFullYear() + constant.landYearsMax)) {
                Toast('最多选择' + constant.landYearsMax + '年时间')
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
              Toast('到期时间不得小于今天')
            } else if (this.gardenForm.startDate) {
              let startDate = new Date(this.gardenForm.startDate).getTime();
              if (new Date(value.toLocaleDateString()).getTime() < startDate) {
                Toast('到期时间不得小于开始时间')
              } else if (new Date(value.toLocaleDateString()).getTime() < new Date(startDate).setFullYear(new Date(startDate).getFullYear() + constant.landYearsMin)) {
                Toast('至少选择' + constant.landYearsMin + '年时间')
              } else if (new Date(value.toLocaleDateString()).getTime() > new Date(startDate).setFullYear(new Date(startDate).getFullYear() + constant.landYearsMax)) {
                Toast('最多选择' + constant.landYearsMax + '年时间')
              } else {
                setDate();
                this.dateShow = false;
              }
            } else {
              setDate();
              this.dateShow = false;
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
      handleLands () {
        if (this.selectedGarden.length) {
          this.selectedGarden.forEach(item1 => {
            this.gardenData.forEach(item2 => {
              if (item1.row === item2.row) {
                item2.lands.forEach(item3 => {
                  if (item3.landId === item1.landId) {
                    item3.landStatus = item1.landStatus
                  }
                })
              }
            });
          })
        }
      },
      getGardenData () {
        axios.post(api.garden.getLandDetails + this.landId).then((res) => {
          this.gardenData = res.data.data;
          this.handleLands();
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
      this.$refs.lands.removeEventListener('scroll', () => {
        this.$refs.row.scrollTop = this.$refs.lands.scrollTop
      })
    }
  }
</script>

<style lang="less" scoped>
  .van-goods-action {
    padding: 1.5vw 4vw;
    background: #fff;
    border-top: 1px solid #E9E9E9;
    text-align: center;
    justify-content: center;
    justify-items: center;
    .footerBtn {
      width: 43vw;
      height: 9vw;
      line-height: 9vw;
      border-radius: 5vw;
      color: #fff;
    }
    .entrustBtn {
      background: #FF7070;
      margin-right: 4vw;
    }
    .autonomyBtn {
      background: #53B2AC;
    }
  }
  .selectedBox {
    padding: 3vw 0;
    width: max-content;
    .selectedLand {
      font-size: 3.5vw;
      border: 1px solid #CDCDCD;
      border-radius: 3px;
      display: inline-block;
      padding: 1vw;
      margin-right: 8vw;
      margin-bottom: 4vw;
      position: relative;
      .van-icon-clear {
        position: absolute;
        right: -2vw;
        top: -2vw;
        font-size: 4vw;
        color: #636363;
      }
    }
  }
  .chooseGardenForm {
    margin-bottom: 1.5vw;
    padding: 0 4vw;
    width: 100vw;
    overflow: scroll;
    background: #fff;
    .van-cell {
      padding: 4vw 0;
      font-size: 4vw;
    }
    .van-cell--required::before {
      left: -7px;
    }
  }
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
        width: 13vw;
        left: 10vw;
      }
    }
  }
  .chooseGarden {
    margin: 1.5vw 0;
    max-height: 110vw;
    background: #beebc4;
    position: relative;
    .row {
      background: #E7FFEA;
      border-radius: 3vw;
      width: 4.5vw;
      position: absolute;
      left: 3vw;
      top: 4vw;
      max-height: 87vw;
      overflow: scroll;
      .rowItem {
        text-align: center;
        font-size: 2.8vw;
        margin: 8vw 0;
      }
    }
    .lands {
      overflow: scroll;
      max-height: 90vw;
      width: 100vw;
      padding-left: 10vw;
      .unit {
        margin-top: 6vw;
        margin-left: 1vw;
        font-size: 2.8vw;
      }
      .landsSelect {
        padding-right: 10vw;
        margin-top: 2vw;
        width: max-content;
      }
      .landsItem {
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
        height: 16.5vw;
        overflow: hidden;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .landAddress {
        color: #7D7D7D;
        font-size: 3.8vw;
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
        /*height: 100%;*/
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
