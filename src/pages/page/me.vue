<template>
  <div id="me-container">
    <!-- 头部 -->
    <div class="me-top-content">
      <image
        class="setting-img"
        src="../../static/me/setting.png"
        @tap="optNavigatorPath('set')"
      />
      <div v-if="noLoginType" class="me-top-header" @tap="userDetailNext">
        <open-data class="me-top-header" type="userAvatarUrl"></open-data>
      </div>
      <image
        v-else
        class="me-top-header"
        mode="aspectFill"
        :src="userImgUrl + userInfo.avatarUrl"
        @tap="userDetailNext"
      />
      <text class="fz-12 fc-999 mr-t-20 mr-b-20" v-if="noLoginType"
        >未登录</text
      >
      <text v-if="!noLoginType" class="fz-15 mr-t-20 header-title fc-000"
        >FIRSTYNAS</text
      >
      <text v-if="!noLoginType" class="fz-11 mr-t-10 fc-000"
        >WELCOME TO OUR HOTEL</text
      >
      <div class="fl-bt me-icon-list">
        <div class="fl-co me-icon-item" @tap="optNavigatorPath('edit')">
          <div class="top-icon-box fl-cen">
            <image class="me-top-icon" src="../../static/me/bianji.png" />
          </div>
          <text class="fz-12 fc-000 mr-t-10">编辑</text>
        </div>
        <div class="fl-co me-icon-item" @tap="optNavigatorPath('guan')">
          <div class="top-icon-box fl-cen">
            <image class="me-top-icon2" src="../../static/me/guanzhu.png" />
          </div>
          <text class="fz-12 fc-000 mr-t-10">关注</text>
        </div>
        <div class="fl-co me-icon-item" @tap="optNavigatorPath('shou')">
          <div class="top-icon-box fl-cen">
            <image class="me-top-icon3" src="../../static/me/shoucang.png" />
          </div>
          <text class="fz-12 fc-000 mr-t-10">收藏</text>
        </div>
        <div class="fl-co me-icon-item" @tap="optNavigatorPath('fans')">
          <div class="top-icon-box fl-cen">
            <image class="me-top-icon4" src="../../static/me/fensi.png" />
          </div>
          <text class="fz-12 fc-000 mr-t-10"
            >粉丝:{{ userInfo.fsNum ? userInfo.fsNum : "0" }}</text
          >
        </div>
      </div>
    </div>
    <!-- 我的服务 -->
    <div class="me-servic-content text-center">
      <text class="fz-15 fw-bold">我的服务</text>
      <div class="me-servic-func fl-bt mr-t-40">
        <div class="fl-co mr-l-59" @tap="openWecat">
          <image
            class="servic-func-icon"
            src="../../static/me/shangchang.png"
          />
          <text class="fz-12">官方商场</text>
        </div>
        <div class="fl-co" @tap="optNavigatorPath('test')">
          <image class="servic-func-icon" src="../../static/me/jiance.png" />
          <text class="fz-12">肌肤检测</text>
        </div>
        <div class="fl-co" @tap="optNavigatorPath('dang')">
          <image class="servic-func-icon" src="../../static/me/dangan.png" />
          <text class="fz-12">肌肤档案</text>
        </div>
        <div class="fl-co mr-r-59" @tap="optNavigatorPath('msg')">
          <image class="servic-func-icon" src="../../static/me/xiaoxi.png" />
          <text class="fz-12">系统消息</text>
        </div>
      </div>
      <div class="me-servic-shar fl-bt" @tap="optNavigatorPath('pos')">
        <div class="mr-l-40 fl-fc text-left">
          <text class="fz-15">和你一起美</text>
          <text class="fz-12 fc-999 mr-t-4">邀请好友，进行免费肌肤测试</text>
        </div>
        <div class="mr-r-40 servic-shar-btn fl-cen">
          <text class="fz-12 fc-000">邀请</text>
        </div>
      </div>
    </div>
    <MovableTop />
  </div>
</template>
<script>
const { userImgUrl } = require("../../config/develop");
export default {
  data() {
    return {
      opId: "",
      userInfo: {},
      userNo: "",
      avatarUrl: "",
      noLoginType: false,
      userImgUrl: userImgUrl,
      userImg: "",
    };
  },
  onLoad() {
    this.userNo = uni.getStorageSync("userno");
    if (!this.userNo) {
      this.noLoginType = true;
    }
  },
  onShow() {
    this.getUserInfo();
  },
  onShareAppMessage() {
    return {};
  },
  methods: {
    // 跳转商城
    openWecat() {
      uni.navigateToMiniProgram({
        appId: "wxc55777954099b5a6",
      });
    },
    async getUserInfo() {
      if (!this.userNo) return;
      const { data } = await this.$api.getAllUserInfo({
        userNo: this.userNo,
      });
      this.userInfo = data;
      // const headerType = this.userInfo.avatarUrl.indexOf("https");
      // if (headerType === 0) {
      //   this.userImg = this.userInfo.avatarUrl;
      // } else {
      //   this.userImg = this.userImgUrl + this.userInfo.avatarUrl;
      // }
      uni.setStorageSync("userInfo", data);
    },
    userDetailNext() {
      if (!this.userNo) {
        uni.reLaunch({
          url: "/pages/page/login",
        });
        return;
      }
      uni.navigateTo({
        url: `/subPackages/me/personDetails?userno=${this.userNo}`,
      });
    },
    // 页面跳转
    optNavigatorPath(path) {
      if (!this.userNo) {
        uni.reLaunch({
          url: "/pages/page/login",
        });
        return;
      }
      switch (path) {
        case "edit": {
          uni.navigateTo({
            url: "/subPackages/me/personEdit",
          });
          break;
        }
        case "guan": {
          uni.navigateTo({
            url: "/subPackages/me/myFollow",
          });
          break;
        }
        case "shou": {
          uni.navigateTo({
            url: "/subPackages/me/myCollection",
          });
          break;
        }
        case "fans": {
          uni.navigateTo({
            url: "/subPackages/me/myFans",
          });
          break;
        }
        case "test": {
          uni.navigateTo({
            url: "/subPackages/Interrogation/test",
          });
          break;
        }
        case "dang": {
          uni.navigateTo({
            url: "/subPackages/me/archives",
          });
          break;
        }
        case "msg": {
          uni.navigateTo({
            url: "/subPackages/me/message",
          });
          break;
        }
        case "set": {
          uni.navigateTo({
            url: "/subPackages/me/setting",
          });
          break;
        }
        case "pos": {
          uni.navigateTo({
            url: "/subPackages/me/poster",
          });
          break;
        }
        default: {
          break;
        }
      }
    },
  },
};
</script>
<style scoped>
.me-top-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 522rpx;
  background-color: #eeeeee;
}
.me-top-header {
  margin-top: 88rpx;
  width: 161rpx;
  height: 161rpx;
  border-radius: 50%;
  overflow: hidden;
}
.me-icon-list {
  margin-top: 28rpx;
  width: 578rpx;
}
.top-icon-box {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  border: 1px solid #7d7d7d;
}
.me-top-icon {
  width: 41rpx;
  height: 35rpx;
}
.me-top-icon2 {
  width: 41rpx;
  height: 33rpx;
}
.me-top-icon3 {
  width: 35rpx;
  height: 33rpx;
}
.me-top-icon4 {
  width: 39rpx;
  height: 36rpx;
}
.me-icon-item {
  width: 140rpx;
}
.header-title {
  letter-spacing: 10rpx;
}
.me-servic-content {
  margin: auto;
  padding-top: 30rpx;
  width: 710rpx;
}
.me-servic-func {
  height: 226rpx;
  background-color: #eeeeee;
  border-radius: 20rpx;
}
.servic-func-icon {
  width: 95rpx;
  height: 95rpx;
  border-radius: 50%;
  margin-bottom: 16rpx;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.me-servic-shar {
  margin-top: 15rpx;
  height: 108rpx;
  border-radius: 20rpx;
  background-color: #eeeeee;
}
.servic-shar-btn {
  width: 80rpx;
  height: 40rpx;
  border: 1px solid #626262;
  border-radius: 20rpx 20rpx;
}
.setting-img {
  position: absolute;
  right: 58rpx;
  top: 40rpx;
  width: 40rpx;
  height: 46rpx;
  z-index: 999;
}
</style>