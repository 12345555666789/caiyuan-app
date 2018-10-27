<template>
    <div style="height: 100vh; width: 100vw;">
      <van-nav-bar
        title="关于"
        fixed
        left-arrow
        @click-left="onClickLeft"></van-nav-bar>
      <div style="height: 12vw"></div>
      <div class="info">
        <div class="logo">
          <img src="../../assets/image/logo.png">
        </div>
        <div class="softInfo">
          <div class="softName">
            <h1 style="text-align: center;margin-bottom: 5vw">菜菜家</h1>
          </div>
          <p class="softVersion">
            V1.0.1 build107365
          </p>
        </div>
      </div>
      <van-cell-group>
        <van-cell class="msgItem" is-link>
          <div class="msgContent">
            <div class="msgTitle">特别声明</div>
          </div>
        </van-cell>
        <van-cell class="msgItem" is-link>
          <div class="msgContent">
            <div class="msgTitle">使用帮助</div>
          </div>
        </van-cell>
        <van-cell class="msgItem" is-link>
          <div class="msgContent">
            <div class="msgTitle">常见问题</div>
          </div>
        </van-cell>
        <van-cell class="msgItem" is-link>
          <div class="msgContent">
            <div class="msgTitle">隐私政策</div>
          </div>
        </van-cell>
      </van-cell-group>
      <div class="copyright">Copyright &copy; 2018.Company 鹏汉科技jinfengguo.com  备案号: 黑ICP备16005961号-1</div>
    </div>
</template>

<script>
    export default {
      name: "info",
      methods: {
        onClickLeft () {
          if (window.app.goBackApp) {
            window.app.goBackApp();
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .copyright {
    color: #A1A1A1;
    text-align: center;
    padding: 20vw;
    padding-top: 10vw;
  }
  .softVersion {
    text-align: center;
    color: #616161;
    margin-bottom: 15vw;
  }
  .info {
    background-color: #fff;
    overflow: hidden;
  }
  .logo {
    width: 30vw;
    height: 30vw;
    margin: 10vw auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .questionIcon {
    display: inline-block;
    width: 6vw;
    height: 6vw;
    position: relative;
    vertical-align: top;
    margin-right: 1vw;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAVFBMVEUAAABWs95VtN9WtN9Ws99MrN5Xs99Ws95Ws95Ws95XtN5Xs95WtN5XtN9XtOFVtN5VtN5YtOFWtt9WtOBWsOJWtN9VtN9Vs99WtN9Ts+BWs99Ws96W2W7KAAAAG3RSTlMA+EeD7AnY8tCxUai6WCNvXzUZlRGOPjGfKZewBfhaAAABM0lEQVQ4y52V246DMAxEx7lAQkq5FEq7+f//XKF20cYxRHAeR6OpawcbDKu0rwyRqbxWFkeoQPEfFBT2aFzMcA0k7rcocrsjo63jDnULho4HaCQ84iEPObec3cYi7daHumyu/3rCeyZ38DsLJlfd206DNkz+TIfNbf6+iJHpbhVVqr0ALH0zAhPLVgBCopgJ1q9vqAO61BwAS4nyA7w+L27BmJrJ8ip6TLTNgVgdfHh+nOOeWcNHGVrwZpJHtePtgZkPAEaergIGYqIBibmr12SqbA6AqvMIuYweoxBi5D+oMAhqJbfuKZo9tJz8FL8tJZmrzkkR20MqQxYIYjSJ/RTraKSaFQA4ofvI+++2D5bR2T7/tTOr4NSSObO+ri3G8sq9vszLZ+L6ASqftutHs3yOfwGhspJLPx2HcgAAAABJRU5ErkJggg==") no-repeat;
    background-size: 100% 100%;
  }
  .exclamationIcon {
    display: inline-block;
    width: 6vw;
    height: 6vw;
    position: relative;
    vertical-align: top;
    margin-right: 1vw;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAQlBMVEUAAAD+hJz+hJz+hJ3/g539hZz+hJz+hJz+hJz9g5v9hJz/g6H/gJr+hJ3+hJ39hJ39hJ39hJz/hZ7+hJz+hJ39hJxib/4oAAAAFXRSTlMA802yRqfrzrh/VSEJ14WRnGUZ3M0gUgawAAAA7UlEQVQ4y52VWXLCMBBEZ6zN2JIMJH3/q6ZSWQpQYxq/T9craeTZ7IEae2jZPbfQY7U9YnLc4Ck+VaeCgTJRdZ1BmdfRXRxP8OXRPWGH0727YZeNnCudveAl/3Gvjpf43z+ZITD/5gID58t42U92xrx9sCeXbzdiINDropklVU5m1VXZq0WoMqJ1Xe4WdDlY0+VmWZezuS67QZfxXhiNV9hCHxhYcFdL9MIOQi6gSYmQiVYdBGffKi3Rz2s90xJlcVzMVl78VthMmWhb8abYaMPqo+DAkFHHlz4Yj4xcfZjra0JfQPpqO7409XX8BbPSdInVrmBDAAAAAElFTkSuQmCC") no-repeat;
    background-size: 100% 100%;
  }
  .msgStatus {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    width: 1.5vw;
    height: 1.5vw;
    background-color: #E32C2C;
    border-radius: 50%;
  }
  .msgContent {
    display: inline-block;
    .msgTitle {
      font-size: 4vw;
      width: 60vw;
      .msgDate {
        font-weight: 500;
        color: #A1A1A1;
        float: right;
        font-size: 3.3vw;
      }
    }
    .msgTxt {
      color: #616161;
      font-size: 3.5vw;
      width: 80vw;
    }
  }
</style>
