<template>
  <div id="app">
    <div v-if="windowLoading" class="windowLoadingShadow">
      <van-loading class="windowLoading" type="spinner" color="white" size="50px"/>
    </div>
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
    </transition>
    <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepAlive"/>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      transitionName: ''
    }
  },
  computed: {
    ...mapState(['windowLoading'])
  },
  watch: {//使用watch 监听$router的变化
    $route (to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = 'slide-left';
      } else {
        this.transitionName = 'slide-right';
      }
    }
  }
};
</script>

<style>
.windowLoadingShadow {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100000;
}
.windowLoading {
  padding: 10px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, .5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
body {
  background-color: #f8f8f8;
  overflow:hidden;
}

.van-cell__title .van-icon {
  font-size: 18px;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
