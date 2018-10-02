<template>
  <div style="height: 100vw; width: 100vw">
    <van-nav-bar
      title="直播"
      @click-left="goApp"
      left-arrow></van-nav-bar>
    <van-tabs v-model="active" swipeable sticky>
      <van-tab title="互动直播">
        <van-pull-refresh v-model="interactionIsLoading" @refresh="onRefreshInteraction">
          <van-tabbar v-model="interactionTabActive" :fixed="false" style="margin-bottom: 1vw;">
            <van-tabbar-item @click="changeinteractionActive(0)" ref="overallSort"><span class="van-tabbar-item__icon iconLive"></span>即将开播</van-tabbar-item>
            <van-tabbar-item @click="changeinteractionActive(1)" ref="stockSort"><span class="van-tabbar-item__icon iconVideo"></span>精彩视频</van-tabbar-item>
          </van-tabbar>
          <van-list
            v-if="interactionData.length"
            v-model="interactionLoading"
            @load="getInteractionTopList"
            style="padding: 0 3vw;background-color: #fff;"
            :finished="interactionFinished">
            <van-cell-group v-for="item in interactionData">
              <van-cell>
                <div class="liveContent">
                  <div class="liveTitle"><span>{{dateFormat(item.startDate)}}开播</span></div>
                  <div class="liveVideo">
                    <div class="videoShadow" style="overflow: hidden;height: 50vw;" @click="videoPlay(item.liveUrl)">
                      <div class="videoTitle">{{item.liveName}}</div>
                      <van-icon name="play"/>
                      <video id="videoView" :src="item.liveUrl" height="100%" width="100%" style="z-index: -1;position: absolute"></video>
                    </div>
                  </div>
                </div>
              </van-cell>
            </van-cell-group>
          </van-list>
          <div class="noDataList"><span>已经到底啦~</span></div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="在线直播">
        <van-pull-refresh v-model="onlineIsLoading" @refresh="onRefreshOnline">
          <van-list
            v-if="onlineData.length"
            v-model="onlineLoading"
            @load="getOnlineTopList"
            style="padding: 0 3vw;background-color: #fff;"
            :finished="onlineFinished">

          </van-list>
          <div class="noDataList"><span>已经到底啦~</span></div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-popup v-model="videoShow" :overlay="true" @click-overlay="cancelDate">
      <video ref="video" :src="videoSrc" controls autoplay height="100%" width="100%"></video>
    </van-popup>
  </div>
</template>

<script>
  import api from '@/config/api';
  import axios from '@/config/axios.config'
  import constant from '@/config/constant'
  import Function from '@/util/function'
    export default {
      name: "liveTelecast",
      data () {
        return {
          videoShow: false,
          videoSrc: '',
          onlineLoading: false,
          interactionLoading: false,
          interactionFinished: false,
          onlineFinished: false,
          interactionIsLoading: false,
          onlineIsLoading: false,
          active: 0,
          interactionTabActive: 0,
          onlineTabActive: 0,
          interactionSortType: 20,
          onlineSortType: 50,
          onlinePage: 0,
          interactionPage: 0,
          count: 10,
          interactionData: [],
          onlineData: []
        }
      },
      mounted () {
        this.getInteractionTopList()
      },
      methods: {
        cancelDate () {
          this.$refs.video.pause();
          this.videoSrc = '';
        },
        videoPlay(src) {
          this.videoSrc = src;
          this.videoShow = true;
        },
        dateFormat (date) {
          return Function.dateFormat(date)
        },
        changeinteractionActive () {

        },
        goApp () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        },
        onRefreshInteraction() {
          this.getInteractionTopList();
        },
        onRefreshOnline() {
          this.getOnlineTopList();
        },
        getInteractionTopList () {
          axios.post(api.live.getInteractionTopList, {
            count: this.count,
            page: this.interactionPage + 1
          }).then(res => {
            this.interactionLoading = false;
            this.interactionIsLoading = false;
            if (res.data.data.length) {
              this.interactionData.push(...res.data.data)
            } else {
              this.interactionFinished = true
            }
          })
        },
        getOnlineTopList () {
          axios.post(api.live.getOnlineTopList, {
            count: this.count,
            page: this.onlinePage + 1
          }).then(res => {

          })
        }
      }
    }
</script>

<style scoped lang="less">
  .liveVideo {
    border-radius: 2vw;
    overflow: hidden;
  }
  .videoTitle {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1vw 3vw;
    font-size: 3.5vw;
    color: #fff;
    max-width: 70vw;
    text-overflow: ellipsis;
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
  .van-tabbar-item--active {
    color: #38ACA5;
    .iconLive {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA2CAMAAABKkMFiAAAAvVBMVEUAAAA4rac4q6U3rqY3rKX///8zqqU4raX3+/vN6uk4rqY3raby+flQt7Hy+vpLta5pwbw4rKU4rKU3rqVfvbdxxb96yMQ3raWi2dWu39s4raU4raba8O/i8/Lj9PI2rqY1r6P4/PyIzsqR0c6h2NW+5eOt3dvO6+nI6Ofc8O/L6eg4rqXi8/E3r6n0+flWubQ4rKaCy8g3rabQ7Ou04d2S0s2f1tPK6eem2tby+vmf19M3raY4rKVAsKlswbxDPWg3AAAAPHRSTlMAL9Jh9z0LyAWhWEQJ+Rr876yETvb04d/bvLySVEA4IRUQ482imJKFdGVkNzAoJPnt0rKtqvHu0s7HxXALXm7VAAABmElEQVRIx+WU2U7DMBBFp2GwTZKmpaF0b6F76UYX9hv+/7NwKgRRESLjN+A8ZRwd3YwzNn2hp/XyeKnp9ehnKsD2aOkcaOUwY4ADyhIw4FMONKBVplZNwKM82Aj2s/UtOM5lKtvWufosW0DzinLhM3j+US1t5Avl40rb0OzGejYyZyjAQWZjT77ra+mfHME25/1RA3z82i8ossy3DCncDA5NueD10mHjmiejxuk41oCKIhnKxtXI6nOSUgCYABRcTPxv05xGbqYZ9evt0MXsVoHycOFgnr4CKA1moZNpqY4iF/MCQHFwcy03H/oJkJRtrNBMzrqNYhr72AmlJkXTTcnGXo5XUpNMt3Ho9rktNC3Xk8sEwP1MbJJp1wEkw1Bsrvbp95bGUjNs10sALp4ikpmLcTkN3NhxEJlmNigCKO8XhkTmblJF+jenRjp9d+s0cNgxLmcl6acdOpjFhg2UmtVDh5H8TljVk3Wja0huUmc3CX/PTf0HTQZisRkATBrw4oKMwEqaYoYL7JOqsIvYUkTK1yz1tK/oDXJTp8XJOo7eAAAAAElFTkSuQmCC") no-repeat;
      background-size: 100% 100%;
      width: 5vw;
      height: 5vw;
      display: inline-block;
      vertical-align: middle;
      margin-right: 1vw;
    }
    .iconVideo {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAMAAAA3KEgwAAAAQlBMVEUAAAA4rKU3raY4rKU3raU4rKU4raY0q6g5q6c4raU4rqY2raY4rKU4rKY2r6U3raU4raY3rKU4raU4raY4raU3rKVjN4B9AAAAFnRSTlMA/olc6fK2EB+lPkbSVSbIddyUZK4va3dF9wAAAb5JREFUSMfllsmS4yAQRMliERKrFv//rw4lWqPxjBUS9GEO/Q4O21EvElAGtvg+MWSiZaRb6kwO8XRDUmhCpfVwV4V2cnWlBlJeCTDyhtVDZymzAfSebROwWCEmDRI3DAbKskOA5307jTSINpnfgKMzr79JZiT2aYKW7bJTGKscfp6MHAvyoewis+pdXoDZF2bAPJDhGZ7eSjtG/MYP9/KJGS6TX/Em+Tiw1RbC256n2ZP9uOfJfk1fnzYBSK7zUbEMlYdeWQMwoVPOicOXoUuWAykAKQytDWNZiGA0oOj1dtqxTh+ymgsKMO8yT2cO9/KUMTM8vYmLhlWZmRIKdN0wnwr+QzJjSQN6OhuWGF+TCTqfDftXdpymX381TF437JTrifup9VGxHDhWURTtsl041riekkxHxTpkc8R2yIzKUfTK6fXg9jRLYQN/PMjATPbTNTQux/RlPaPZpmcX4EESLbcnX70EkCtkPLv0pWOy/u+/Vd+TZYesMXb/J1kBqgvwsVW2CVrWL7BNbfI0Asnu61WAGok/0x0z9EI0svFVwODRzByqy6uYNRrQ8+j+2Et0UuYsb1nzWl5dHHbtFxcPHN46SyGiAAAAAElFTkSuQmCC") no-repeat;
      background-size: 100% 100%;
      width: 6vw;
      height: 5vw;
      display: inline-block;
      vertical-align: middle;
      margin-right: 1.5vw;
    }
  }
  .iconLive {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA2CAMAAABKkMFiAAAA51BMVEUAAAAZGRkbGxsaGhr///8aGhobGxvGxsYaGhoaGhr19fUbGxsSEhIbGxsaGhrv7+/x8fExMTFSUlIbGxsbGxsbGxsZGRkmJiY8PDwbGxujo6MaGhrV1dXY2Ng3NzdaWlpJSUkaGhpubm6WlpYaGhqTk5O2trbW1tbBwcHh4eHU1NQaGhrv7+8ZGRn///8sLCxiYmKPj49zc3NtbW2EhIQbGxvJycmpqamenp6vr6/Nzc23t7ccHBzq6upFRUWCgoJ7e3ubm5vCwsJ8fHzw8PCRkZHOzs4bGxv///8bGxtWVlYjIyMfHx/W0jxaAAAASXRSTlMAL9JhPfT5oVhEBccNza4aCfvwhU4kB/z537ySVDL59vbu1dTBopllZEA9NyQUDv3o5+bfz7mtqpWMg3UbEfzx3dzSyMfFcnA0abIDDAAAAalJREFUSMftlNlOwmAQhafoX//uBQqyKquIIO77vnuk7/88To0JBGPs9E7jd9VO8+VkTialL5Q8r7Qwuuzx6GeKgL8w8oF6CjMCTIvmsUxAUwo8wCnTjPIR4FEaLAWl59/bUFEq0/UB351F1oHeNqVCK7RHs67bMF8oHdsOh84Xm7uklOik3rlil77by9BLCyjA+3zkfLX4WRsuMSPfhBTzyPpYKgu5UnJsZjUno6qAOlWBoksyyhxXJQAjkmIASEzj3xSb9nKQzbQ39ruNMIv5uou40G9mMJffAOQPB2Emk1nfCLKYrSmw9rB5JTan97erwLTAsVJzZatWiTm2OwylJgUXnR2O3T0dS02ym7VrcOxTQ2gyk/MD3hZ7A7FJdmMPwGo/FJvjkxaA/JnUDBvdPBC3HgOSmc3TQsyBnc2JrCF7cMiBKJw0bRKZx2frSTcHz+yJzPimkhxff8sWX3zM4n5y8GITcaU2JJKavOJO5yIgsTm+m1ZqvKHcpOHx+eT3/Kn/oKmASGxagKIe4EWGDMsBHIoUsmBqKhdVFrHuErnaUVLP0S69A8nby1SWFUenAAAAAElFTkSuQmCC") no-repeat;
    background-size: 100% 100%;
    width: 5vw;
    height: 5vw;
    display: inline-block;
    vertical-align: middle;
    margin-right: 1vw;
  }
  .iconVideo {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAMAAAA3KEgwAAAATlBMVEUAAAAODg4aGhoaGhoYGBgaGhoaGhoYGBgSEhIbGxsaGhoaGhoaGhodHR0YGBgbGxsaGhoaGhobGxsbGxsaGhobGxsbGxsaGhoZGRkbGxtTmbPZAAAAGXRSTlMAB4zyXOm2Hg+FQ6TSPidW3Mh2lWSsT202Gy5LwAAAAd9JREFUSMflltuWoyAQRbkjaBDQXM7//+gUtK3dK5PQOA/z0HtlJSardsrCEyLb4F2wr4RbFmIZRZtak+ew+3xOGl3otH7aq0Y3MrOKkkDKq5MwqsE6Qd6VyoZsVVybAGE5u0gI1mAw0LY41GkKdHCTSPRBj1wP5MoYz0BmnXKdVXDGHaTql73GSLKAnH+hnAOhfij7UFhllRcgTkQEDG/LmKat+kryiJ1paMsHZiinfXRmByHwRudt5rsl5m8z+zg5+9eZH7ZWv1ttByD5k5dKgNDZnpUlPcyNn5JlTqX5MpyS1eA06enG38r3mrAnmfGbkdRchOeEqU8ZOhLUxXyX6cXm2lzxXUas6HcJq3LBJ2oOwV8nLBHTc+eKFWRLfyQsbdXXlwk7ZG9ActhnvtiCaqx2lT9WfPLdl4qV5SZVu8D6ZbuUtsbzEyHxNWJiOJNto2u4T2W7ELNlZ+X0aP+eYRbiCoxHWaa2zrJnWY5LwVD1y3gGc/W8vQEu2EmsZ/fc4uk8kX+46Sv/Uf3//6tOyv94Z8Dup+5JVgnH63dMoVe2iYbdrt31wXtk/hiBZOv5akCPrrx3DUSEXJwbi+FZZY7oJs5s4zJG2WPKOH4J/hC8Uvesmqx5pWcfhqr9AbSyUZjojmjoAAAAAElFTkSuQmCC") no-repeat;
    background-size: 100% 100%;
    width: 6vw;
    height: 5vw;
    display: inline-block;
    vertical-align: middle;
    margin-right: 1.5vw;
  }
</style>
