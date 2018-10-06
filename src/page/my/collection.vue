<template>
  <div style="height: 100vh; width: 100vw">
    <van-nav-bar
      title="我的收藏"
      @click-left="goApp"
      left-arrow></van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-if="favorData.length"
        v-model="loading"
        @load="getCollectionList"
        :finished="finished">
        <van-cell v-for="item in favorData" @click="toWikiInfo(item.wikiId)" :key="item.wikiId">
          <div class="wikiTitle"><span class="questionIcon"></span>{{item.title}}</div>
          <div class="wikiContent">
            <div class="wikiPic"><img v-lazy="item.wikiPics[0]"></div>
            <div class="wikiDesc">
              <p class="wikiTxt">{{item.txt}}</p>
              <p class="favorCount">
                <span class="favorIcon"></span>
                <span>{{item.favorCount}}</span>
              </p>
            </div>
          </div>
        </van-cell>
        <div class="noDataList"><span>已经到底啦~</span></div>
      </van-list>
      <div class="carNoData" v-else>暂无数据</div>
    </van-pull-refresh>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import Function from '@/util/function'
    export default {
      name: "collection",
      data () {
        return {
          page: 0,
          count: 10,
          isLoading: false,
          finished: false,
          loading: false,
          favorData: []
        }
      },
      mounted () {
        this.getCollectionList()
      },
      methods: {
        toWikiInfo (id) {
          this.$router.push({
            path: '/wikiDetails',
            query: {
              wikiId: id
            }
          })
        },
        onRefresh() {
          this.page = 0;
          this.getCollectionList()
        },
        goApp () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        },
        getCollectionList () {
          axios.post(api.my.getFavorList, {
            page: this.page + 1,
            count: this.count
          }).then((res) => {
            this.page += 1;
            this.isLoading = false;
            if (res.data.data.length) {
              this.favorData.push(...res.data.data)
            } else {
              this.finished = true
            }
          })
        }
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
  .wikiTitle {
    margin-bottom: 2vw;
    font-weight: 600;
    font-size: 4vw;
    .questionIcon {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAMAAADfNcjQAAAAclBMVEUAAACM1NCN1M+N1NCN09CM08+M09CM1NCM1NCM08+M09CO1dCK09OM0s+M1c+N19KM1tKK1cqM08/////P7evH6eeb2dWO1NDv+fmv4N6p39z4/Pz7/f3f8vHb8fDW7+265OKz4t+i29iW1tPn9fXA5uQnaHv0AAAAEnRSTlMA+rNxLevTzsa+nEgjqT81UBiMIi3nAAAA5klEQVQ4y6WSWW7DMAxEKXlJXGdpNdq8x3Z6/ys2rYvGNSQGQd6PCPABkjgkomQnVBCRJ3RDKgZJlCiWhHJeyEnwgiD1gCeFSne9maKCveIHHRGsR9ProQF0WOhxnW/H7AEbEixQLw8BPkNChWYpHKBDwoj2TzDBK/ywFBeg5gY1NfAuLjjTAhUz6g5oRyaLChgsF5ZBx6dZ+8vDuF8UZm0cKxhgZIT7mO9st7qetlu9Vyw7SjOuL0qijzcRazuZ0jeHiFKcaSGsFCdaczj+V/Yn2pIeV+2SQqTy92slxTjLLCveac0XOUBJs9rK7AAAAAAASUVORK5CYII=") no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      width: 4.5vw;
      height: 5vw;
      vertical-align: text-top;
      margin-right: 2vw;
    }
  }
  .wikiContent {
    .wikiPic {
      display: inline-block;
      width: 35vw;
      height: 26vw;
      overflow: hidden;
      border-radius: 3px;
      img {
        width: 100%;
      }
    }
    .wikiDesc {
      display: inline-block;
      vertical-align: top;
      width: 54vw;
      .wikiTxt {
        height: 20vw;
        font-size: 3.5vw;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .favorCount {
        color: #a1a1a1;
        text-align: right;
        font-size: 3.5vw;
        .favorIcon {
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA7CAMAAAD7EKL7AAAAbFBMVEUAAAA4ODg/Pz8/Pz9BQUFAQEBAQEBAQEBAQEBAQEA+Pj5AQEA/Pz9AQEBBQUE/Pz9AQEBAQEBAQEBAQEA/Pz9AQEBAQEBAQEBAQEBBQUFAQEBAQEBAQEBAQEBBQUFAQEBAQEBAQEBAQEBAQEBN63XYAAAAI3RSTlMABA3nRybM97HUFDbu4B8ZbqeFPtuan42/X2ZRL5NXxbh1foPh0CEAAALgSURBVEjHnVbn2qowDCYdUCgbHOCW+7/H06SfHioglvxQ+qRvdpoEHwTMEEAwJbCs4Auxc1fvlaoOpSjABReiPFRK7etOsyV0p9p0IIp4WMsRSz5DHllW2qqezaG1GhziZfLHSvrMZR31xI2i5lZ8Focxt9fuDV6Dl2BuOFlqPw+5C092ZF5cCy2lbDplj8KwmpA8Un1jOFrU9lgVjvGVtfjtGOg7SkgFaP5hMes5GcdG8D2JlI7IEp1u+9j8Zg8nYpKM3SdvZR16dSg+8i1atADhAj68rVHfA17y8GI9rQzNbbCaCQeeKPb8d7iYgxppd+2KSpiyEvR4Zxk6HeuYhFUlc6xzZnzTpAVFXebrWvKBy1kOHAyqQlTeDvOXSE2PTi6ItjDByRNPoqilV/NfGkNOgT8JzDkEbGcyITfg89jElgXMdEdYbMCzoynr5PXnTS/FSUhmeBM1TZwT/r4Jv7P42zDcNtlfEZ7cyDfgkyMqpjrg5w14mZkCZgGU0TCUG/AdNb2t3/uG+lW2foMipE70pbPp+jYfdaIfwY66/t2JwhOvqX3/P2YV80v+YfRkyhhfei98w4338uXLI/KsQXaj5n+3cojH3z2AGofb6NG4mjO//owXOBg6cLLh0QXFEceXk/H8ZifaL5SQMul6RCbt2S+xuwxYuTAz0aInrKGx32anJcOhzDtYg5/Q0B2biUpFSYAVeIa7w2ykZYyOndbqjgb3LGkso1bAsnbahWK92FTEPsESXMTIF9+7cuCn5bJb6XQQGfp3giXtxPtGIsRLPUzhXUbRWctvg9fSyc4DV2s8rD8N8WiVdJfGGOGrpI9owaFwFr4Ue6b5cbLQilsl41GJ2n+eUjmtz0qCdV0qWqA9hmRxQQGhAIroDbXvvWYsqwdKNma0xc+L54iHktOOnFO78wd4z8driwLCiOppw4IC2E1EoYZgCxVV5ATeX0B5D48PhG8kSPLiu+3/AGPlUQRM2HhZAAAAAElFTkSuQmCC") no-repeat;
          width: 4.2vw;
          height: 4vw;
          display: inline-block;
          background-size: 100% 100%;
          vertical-align: sub;
        }
      }
    }
  }

</style>
