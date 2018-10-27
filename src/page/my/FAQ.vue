<template>
    <div style="height: 100vh; width: 100vw;background-color: #fff">
      <van-nav-bar
        title="常见问题"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 12vw"></div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          @load="getQuestion"
          :finished="finished">
          <van-cell v-for="(item, index) in list" :key="item.msgId + index">
            <div class="title">{{item.title}}</div>
            <p><span class="createDate">{{dateFormat(item.createDate, 'YYYY-MM-DD H:M')}}</span></p>
            <div v-if="item.content" :class="!item.state ? 'content ellipse' : 'content'">{{item.content}}
              <p @click="handleArrow(item)" style="text-align: center;font-size: 3vw;color:#BFBFBF;">{{!item.state ? '展开' : '收起'}}<span :class="!item.state ? 'arrow-down' : 'arrow-up'"></span></p>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import Function from '@/util/function'
    export default {
      name: "help",
      data () {
        return {
          finished: false,
          loading: false,
          isLoading: false,
          page: 0,
          list: []
        }
      },
      methods: {
        handleArrow (data) {
          let list = this.list;
          list.forEach(item => {
            if (data.msgId === item.msgId) {
              item.state = !item.state
            }
          });
          this.list = list
        },
        getQuestion () {
          axios.post(api.help.list, {
            "count": 10,
            "helpCat": 4,
            "page": this.page + 1,
          }).then(res => {
            this.loading = false;
            this.isLoading = false;
            if (res.data.data.length) {
              this.page += 1;
              res.data.data.forEach(item => {
                item.state = 0
              });
              this.list.push(...res.data.data)
            } else {
              this.finished = true;
            }
          })
        },
        dateFormat (date, format) {
          return Function.dateFormat(date, format)
        },
        onRefresh () {
          this.page = 0;
          this.list = [];
          this.getQuestion()
        },
        onClickLeft () {
          window.history.back()
        },
      }
    }
</script>

<style scoped lang="less">
  .arrow-up {
    display: inline-block;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMBAMAAACZySCyAAAAElBMVEUAAADPz8/Pz8/Pz8/Ozs7Pz8/PcVWYAAAABXRSTlMA6qpVFQVXMqEAAAA4SURBVAjXLcnBCQBACANBwRZs4f62cC0I6b8VA+t+Ephw2UG/7rxhU2pEKkSaExtiQ2wnNsSG2BZFQA/xYYQm6gAAAABJRU5ErkJggg==") no-repeat;
    background-size: 100% 100%;
    width: 2vw;
    height: 1.5vw;
  }
  .arrow-down {
    display: inline-block;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMBAMAAACZySCyAAAAElBMVEUAAADPz8/Pz8/Pz8/Ozs7Pz8/PcVWYAAAABXRSTlMA6qpVFQVXMqEAAAA4SURBVAjXLcnBCQBACANBwRZs4f62cC0I6b8VA+t+Ephw2UG/7rxhU2pEKkSaExtiQ2wnNsSG2BZFQA/xYYQm6gAAAABJRU5ErkJggg==") no-repeat;
    transform: rotate(180deg);
    background-size: 100% 100%;
    width: 2vw;
    height: 1.5vw;
  }
  .title {
    font-size: 4vw;
    font-weight: 600;
  }
  .createDate {
    font-size: 3vw;
    color: #A1A1A1;
  }
  .content {
    color: #616161;
    margin-top: 3vw;
    font-size: 3.8vw;
  }
</style>
