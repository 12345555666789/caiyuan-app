<template>
  <div style="height: 100vh; width: 100vw">
    <van-nav-bar
      title="百科"
      fixed
      left-arrow
      @click-right="favor"
      @click-left="goApp">
      <span v-if="wikiInfo.userFavor" class="iconFavored" slot="right"></span>
      <span v-else class="iconFavor" slot="right"></span>
    </van-nav-bar>
    <div style="height: 15vw"></div>
    <van-pull-refresh v-model="isLoading" @refresh="getwikiInfo">
      <div class="wikiInfo">
        <div class="wikiContent">
          <p class="wikiTitle">{{wikiInfo.title}}</p>
          <p class="wikiDesc">{{wikiInfo.txt}}</p>
          <div class="wikiPics">
            <div class="wikiPic" v-for="item in wikiInfo.wikiPics">
              <img v-lazy="item">
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div style="height: 14vw"></div>
  </div>
</template>
<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import Function from '@/util/function'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "wikiDetails",
    data() {
      return {
        isFavor: false,
        loading: false,
        message: '',
        isLoading: false,
        wikiInfo: {},
      }
    },
    computed: {
      ...mapState(['userInfo', 'userAction'])
    },
    activated () {
      this.wikiInfo = {};
      this.getwikiInfo();
    },
    methods: {
      ...mapMutations(['setUserAction', 'setUserInfo']),
      toLogin () {
        if (window.app.toLogin) {
          window.app.toLogin()
        } else {
          this.$toast('Native错误');
        }
      },
      favor () {
        if (window.app.getToken && window.app.getToken()) {
          if (!this.wikiInfo.userFavor) {
            axios.post(api.common.userAction, {
              "actionType": constant.actionType.favor,
              "objId": this.$route.query.wikiId,
              "objType": constant.infoType.wiki
            }).then(() => {
              this.getwikiInfo();
            })
          }
        } else {
          this.toLogin()
        }
      },
      dateFormat (date, format) {
        return Function.dateFormat(date, format)
      },
      goApp () {
        if (this.$route.query.from) {
          window.history.back()
        } else {
          if (window.app.goBackApp()) {
            window.app.goBackApp();
          } else {
            this.$toast('Native错误');
          }
        }
      },
      getwikiInfo() {
        axios.post(api.common.getInfo, {
          objId: this.$route.query.wikiId,
          objType: constant.infoType.wiki
        }).then((res) => {
          this.wikiInfo = res.data.data;
          this.isLoading = false
        }).catch((err) => {
          this.isLoading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .wikiContent {
    background-color: #fff;
    padding: 5vw 3vw;
    width: 100vw;
    overflow: hidden;
    .wikiTitle {
      font-size: 4.8vw;
      font-weight: 600;
      margin-bottom: 4vw;
    }
    .userInfo {
      margin-bottom: 8vw;
      .avatar {
        display: inline-block;
        width: 8vw;
        height: 8vw;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 2vw;
        vertical-align: text-bottom;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .username {
        vertical-align: super;
        color: #505050;
      }
      .createDate {
        float: right;
        margin-top: 2vw;
        color: #a1a1a1;
      }
    }
    .wikiDesc {
      color: #505050;
      margin-bottom: 6vw;
    }
    .wikiPics {
      overflow: hidden;
      border-radius: 3px;
      img {
        /*height: 100%;*/
        width: 100%;
      }
    }
    .wikiVideos {
      video {
        height: 100%;
        width: 100%;
      }
    }
  }
  .iconFavor {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA7CAMAAAD7EKL7AAAAbFBMVEUAAAA4ODg/Pz8/Pz9BQUFAQEBAQEBAQEBAQEBAQEA+Pj5AQEA/Pz9AQEBBQUE/Pz9AQEBAQEBAQEBAQEA/Pz9AQEBAQEBAQEBAQEBBQUFAQEBAQEBAQEBAQEBBQUFAQEBAQEBAQEBAQEBAQEBN63XYAAAAI3RSTlMABA3nRybM97HUFDbu4B8ZbqeFPtuan42/X2ZRL5NXxbh1foPh0CEAAALgSURBVEjHnVbn2qowDCYdUCgbHOCW+7/H06SfHioglvxQ+qRvdpoEHwTMEEAwJbCs4Auxc1fvlaoOpSjABReiPFRK7etOsyV0p9p0IIp4WMsRSz5DHllW2qqezaG1GhziZfLHSvrMZR31xI2i5lZ8Focxt9fuDV6Dl2BuOFlqPw+5C092ZF5cCy2lbDplj8KwmpA8Un1jOFrU9lgVjvGVtfjtGOg7SkgFaP5hMes5GcdG8D2JlI7IEp1u+9j8Zg8nYpKM3SdvZR16dSg+8i1atADhAj68rVHfA17y8GI9rQzNbbCaCQeeKPb8d7iYgxppd+2KSpiyEvR4Zxk6HeuYhFUlc6xzZnzTpAVFXebrWvKBy1kOHAyqQlTeDvOXSE2PTi6ItjDByRNPoqilV/NfGkNOgT8JzDkEbGcyITfg89jElgXMdEdYbMCzoynr5PXnTS/FSUhmeBM1TZwT/r4Jv7P42zDcNtlfEZ7cyDfgkyMqpjrg5w14mZkCZgGU0TCUG/AdNb2t3/uG+lW2foMipE70pbPp+jYfdaIfwY66/t2JwhOvqX3/P2YV80v+YfRkyhhfei98w4338uXLI/KsQXaj5n+3cojH3z2AGofb6NG4mjO//owXOBg6cLLh0QXFEceXk/H8ZifaL5SQMul6RCbt2S+xuwxYuTAz0aInrKGx32anJcOhzDtYg5/Q0B2biUpFSYAVeIa7w2ykZYyOndbqjgb3LGkso1bAsnbahWK92FTEPsESXMTIF9+7cuCn5bJb6XQQGfp3giXtxPtGIsRLPUzhXUbRWctvg9fSyc4DV2s8rD8N8WiVdJfGGOGrpI9owaFwFr4Ue6b5cbLQilsl41GJ2n+eUjmtz0qCdV0qWqA9hmRxQQGhAIroDbXvvWYsqwdKNma0xc+L54iHktOOnFO78wd4z8driwLCiOppw4IC2E1EoYZgCxVV5ATeX0B5D48PhG8kSPLiu+3/AGPlUQRM2HhZAAAAAElFTkSuQmCC") no-repeat;
    width: 5vw;
    height: 4.5vw;
    display: inline-block;
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .iconFavored {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA7CAMAAAD7EKL7AAAAb1BMVEUAAAD/bm7/cHD/bGz/b2//b2//cXH/b2//b2//b2//b2//b2//b2//b2//b2//b2//cHD/b2//b2//cXH/b2//b2//cHD/cHD/cHD/b2//b2//b2//cHD/cHD/cHD/cHD/b2//cHD/cHD/cHD/b287xwceAAAAJHRSTlMADB8Hyp0U+dZJGfHn29CxbvbsPC/hjIQ3v7arYlhCpJMndX1DK0mlAAABtklEQVRIx8XVWZKjMBAE0JTEJrEbzO616/5nnDZDj41lbKj+mPdbkUFURQJ4Jr4pvKKskZUth9rt01OVaYM5c8yqU5q69VCKpfTQxyGN/MipL7iTX06U0yiM00HAppqOZqLMm0ZetqeZtrDWMHVEz7ojbprUmkSVxIzn5mQLNIAiIZt/MrPVe3op1Ch29FInHuIuLYizgBacPPwYQlqyPMmvaorLmDj25ZQ/E4+LURkST9iMxXGJq1fT9kzRreN6R1zhAUDmE1s1docvFRAp8bUevJb4HAPPIb5A/t98IiE64nM8qDPx9eJX/fFrAMdf9tckxBVLfKuI64wbyV1gd8Hoi3hq/CUD3vYlJlefEfcrhYl0ON0v8c+B8fgDHrjMjz97g+SCGb3b3twJpwS1whPh5utv5wpYTE9rdRIvyGDTj9vWJOuKU2BB4ayJH7GoieiTncYbev9pd4239PsbxBofFHtaFml8dAxYp7tr2oW4U2CVi0OvJCVWkmlud76TWM2cc+uVkdhAVDR39rCJyqLH0l0VNlKH+F66QWG7xvk5fKHAYU63K+apBJPJ2qS9SvB50uCtP3v0VU5Ol+1mAAAAAElFTkSuQmCC") no-repeat;
    width: 5vw;
    height: 4.5vw;
    display: inline-block;
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .van-goods-action {
    padding: 1.5vw 4vw;
    background: #fff;
    border-top: 1px solid #E9E9E9;
    .entrustBtn {
      background: #FF7070;
    }
  }
  .commentSend {
    padding: 0 3vw;
    position: fixed;
    width: 100vw;
    bottom: 0;
    background-color: #fff;
    .van-button--default {
      border: 1px solid #38ACA5;
      color: #38ACA5;
    }
    .van-cell {
      padding: 10px 0;
    }
    [class*=van-hairline]::after {
      border-top: 0 #fff;
    }
  }
  .comments {
    background: #fff;
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
  .videoShadow {
    background: rgba(0, 0, 0, 0.54);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
    .van-icon-play {
      color: #fff;
      font-size: 10vw;
      display: flex;
      justify-content: center;
      justify-items: center;
      align-items: center;
    }
  }

  .icon-plus {
    font-size: 5vw;
    font-weight: 900;
    vertical-align: middle;
  }

  .footerBtnText {
    margin-left: 1vw;
    margin-right: 4vw;
  }

  .van-button--bottom-action {
    background-color: #53B2AC;
  }
</style>
