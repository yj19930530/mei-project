<template>
  <div id="ganhuo-container">
    <div style="height: 20rpx"></div>
    <div class="video-item-box" v-for="(item, index) in ganVideo" :key="index">
      <div class="video-item-cover">
        <image
          mode="aspectFill"
          class="cover-img"
          :src="atcImgUrl + item.preview"
          v-if="item.playType"
        />
        <video
          v-if="!item.playType"
          :id="'myVideo' + index"
          class="video-style mr-t-10"
          controls
          :src="atcImgUrl + item.video"
          @ended="videoEndHandle(index)"
        ></video>
        <div class="video-item-center" v-if="item.playType">
          <text class="fz-14 fc-fff">{{ item.title }}</text>
          <div class="fl-cen" @tap="playerVideo(index)">
            <image
              class="video-player"
              src="../../static/college/ganhuovideo.png"
            />
          </div>
          <!-- <div class="fl-bt decribe-text-style">
            <text class="fz-12 fc-fff">802万次观看</text>
            <text class="fz-12 fc-fff">0:51</text>
          </div>-->
        </div>
      </div>
      <div class="video-item-user fl-bt">
        <div class="fl-al">
          <image
            class="video-user-img"
            :src="userImgUrl + item.sui.avatarUrl"
          />
          <text class="fz-15">{{ item.sui.nickName }}</text>
        </div>
        <div class="share-btn-box" @tap="toSharePath">
          <text class="iconfont iconfenxiang fz-20 fc-333"></text>
          <button
            type="primary"
            class="share-visibiliti-btn"
            open-type="share"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const { toast } = require("../../utils/index");
const { atcImgUrl, userImgUrl } = require("../../config/develop");
export default {
  data() {
    return {
      ganVideo: [],
      more: true,
      pageNo: 1,
      pageSize: 10,
      atcImgUrl: atcImgUrl,
      userImgUrl: userImgUrl,
    };
  },
  onShareAppMessage(res) {
    return {
      title: "干货视频",
      path: "/subPackages/college/videoDetail",
    };
  },
  // 下拉刷新
  async onPullDownRefresh() {
    await this.resetData();
    await this.getVideo();
    uni.stopPullDownRefresh();
  },
  // 上拉加载更多
  onReachBottom() {
    if (!this.more) return;
    this.pageNo++;
    this.getVideo();
  },
  onLoad() {
    this.getVideo();
  },
  methods: {
    videoEndHandle(i) {
      let videoContent = uni.createVideoContext(`myVideo${i}`);
      videoContent.stop();
      this.ganVideo[i].playType = true;
    },
    // 播放视频
    playerVideo(i) {
      this.ganVideo.forEach((item, index) => {
        if (index === i) {
          this.ganVideo[index].playType = false;
          const timer = setTimeout(() => {
            let videoContent = uni.createVideoContext(`myVideo${i}`);
            videoContent.play();
            clearTimeout(timer);
          }, 500);
        } else {
          let videoContent = uni.createVideoContext(`myVideo${i}`);
          videoContent.stop();
          this.ganVideo[index].playType = true;
        }
      });
    },
    resetData() {
      this.ganVideo = [];
      this.more = true;
      this.pageNo = 1;
      this.pageSize = 4;
    },
    async getVideo() {
      toast.showLoading("加载中");
      const { data } = await this.$api.getCollegeList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        index: 2,
        label: "干货视频",
      });
      data.page.list.forEach((item) => {
        item.playType = true;
      });
      this.ganVideo = this.ganVideo.concat(data.page.list);
      if (
        data.page.list === 0 ||
        this.pageNo * this.pageSize > this.ganVideo.length
      ) {
        this.more = false;
      }
      uni.hideLoading();
    },
  },
};
</script>
<style>
page {
  background-color: #f8f8f8;
}
</style>
<style scoped>
.video-item-box {
  padding: 0rpx 20rpx 0 20rpx;
  background-color: #ffffff;
}
.share-visibiliti-btn {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
}
.video-item-cover {
  position: relative;
  width: 710rpx;
  height: 400rpx;
}
.share-btn-box {
  position: relative;
}
.cover-img {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.video-item-center {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 30rpx;
  top: 14rpx;
  right: 30rpx;
  bottom: 18rpx;
}
.video-player {
  margin: 114rpx 0 114rpx 0;
  width: 68rpx;
  height: 68rpx;
}
.decribe-text-style {
  width: 100%;
}
.video-item-user {
  height: 120rpx;
}
.video-user-img {
  margin-right: 18rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.video-style {
  width: 710rpx;
  height: 400rpx;
}
</style>