<template>
  <div id="atc-detail-container" v-if="pageType">
    <!-- 轮播图 -->
    <div style="height:800rpx">
      <swiper
        class="swiper"
        style="height: 100%"
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item v-for="(item, index) in imgShowList" :key="index">
          <image
            mode="aspectFill"
            class="show-img-item"
            :src="httpImg + item"
            @tap="prewImgFunc2(index, imgShowList)"
          />
        </swiper-item>
      </swiper>
    </div>

    <!-- 头部标题 -->
    <div class="atc-detail-title">
      <text class="fz-17 fw-bold">{{ atcObj.title }}</text>
      <div class="mr-t-30 fl-bt">
        <text class="fz-12 fc-999">浏览 {{ atcObj.browse }}</text>
        <text class="fz-12 fc-999">作者：{{ atcObj.sui.nickName }}</text>
      </div>
    </div>
    <div class="fl-cen mr-t-20 mr-b-20" v-if="atcObj.video">
      <video
        id="myVideo"
        class="video-style mr-t-10"
        controls
        :poster="httpImg + atcObj.preview"
        :src="httpImg + atcObj.video"
        @play="allPing"
        @fullscreenchange="videoChange"
      ></video>
    </div>
    <!-- 内容 -->
    <div class="atc-detail-content">
      <Uparse :content="atcObj.contens" />
    </div>
    <!-- <div class="fl-co atc-detail-content">
      <image
        mode="widthFix"
        class="show-img-item"
        v-for="(item, index) in imgShowList"
        :key="index"
        :src="httpImg + item"
        @tap="prewImgFunc2(index, imgShowList)"
      />
    </div> -->
    <!-- 用户 -->
    <div class="atc-user-content fl-bt">
      <div class="mr-l-30 fl-al">
        <image
          v-if="atcObj.sui.avatarUrl"
          class="user-left-img"
          :src="userImgUrl + atcObj.sui.avatarUrl"
          @tap="userDetailNext(atcObj.sui.userno)"
        />
        <image
          v-else
          class="user-left-img"
          src="../../static/default-header.png"
          @tap="userDetailNext(atcObj.sui.userno)"
        />
        <text class="fz-15 fw-bold">{{ atcObj.sui.nickName }}</text>
      </div>
      <div
        class="follow-btn mr-r-30 fl-cen"
        v-if="!atcObj.fans.length"
        @tap="handleClick('gz')"
      >
        <text class="fz-12 fc-fff">关注</text>
      </div>
      <div class="follow-btn2 mr-r-30 fl-cen" v-else @tap="handleClick('qgz')">
        <text class="fz-12 fc-fff">已关注</text>
      </div>
    </div>
    <div class="zhezhao-bg" @tap="inputBlurChange" v-if="commentType"></div>
    <!-- 输入框 -->
    <div class="comment-box fl-co" v-if="commentType">
      <div class="comment-title-box mr-b-10">
        <text class="fz-17 fw-bold">评论:</text>
        <text class="fz-17 fw-bold mr-t-4">{{ atcObj.title }}</text>
      </div>
      <textarea
        :fixed="true"
        :adjust-position="true"
        :show-confirm-bar="true"
        :cursor-spacing="commentHeight + 20"
        @keyboardheightchange="getHeigth"
        :placeholder="commentPlace"
        maxlength="300"
        :auto-height="false"
        class="comment-content-input"
        v-model="commentForm.componentInfo"
        @input="getText"
      />
      <div class="fl-fc mr-t-30 mr-b-50" style="width: 670rpx">
        <div class="fl-al">
          <div
            class="comment-upload-img"
            v-for="(item, index) in commentImgList"
            :key="index"
          >
            <image
              mode="aspectFill"
              @tap="prewImgFunc(index, commentImgList)"
              class="upload-img-item"
              :src="item.imgPath"
            />
            <div
              class="upload-img-delete fz-10 fc-fff fl-cen"
              @tap="deleteImg(index)"
            >
              X
            </div>
          </div>
        </div>
        <div class="fl-bt mr-t-20">
          <div class="fl-al" @tap.native.stop="uploadImgComment" v-if="hType">
            <image
              class="comment-icon-upload"
              src="../../static/me/uploadimg.png"
            />
            <text class="fz-14 mr-l-10">上传图片</text>
            <text class="fz-14 fc-999 mr-l-10">最多上传3张</text>
          </div>
          <text class="fz-14 fc-999">{{ textLength }}/300</text>
        </div>
      </div>
      <div class="comment-submit-btn fl-cen" @tap="submitComment">
        <text class="fz-20 fc-fff fw-bold">评论</text>
      </div>
    </div>
    <!-- 精选评论 -->
    <div class="fl-bt comment-title">
      <text class="fz-15 fw-bold">精选评论</text>
      <div class="fl-al" @tap.native.stop="getComHeight">
        <text class="iconfont iconziyuan fz-17 fc-999"></text>
        <text class="fz-14 fc-999 mr-l-10">写评论</text>
      </div>
    </div>
    <div
      class="comment-content"
      v-for="(item, index) in componentList"
      :key="index"
    >
      <div class="comment-item-box">
        <image
          class="header-img mr-l-20"
          :src="userImgUrl + item.avatarUrl"
          @tap="userDetailNext(item.userno)"
        />
        <div class="item-right-coentent mr-r-20">
          <text class="fc-333 fz-15">{{ item.nickName }}</text>
          <text class="fz-14 mr-t-10">{{ item.componentInfo }}</text>
          <text
            class="fz-12 fc-999 mr-t-10"
            :class="[item.userno == userNo ? '' : 'show-hide']"
            @tap="deleteMyComment(item)"
            >删除</text
          >
          <div class="fl-bw mr-t-10">
            <image
              v-for="(img, imgIndex) in item.img"
              @tap="prewImgFunc2(imgIndex, item.img)"
              :key="imgIndex"
              mode="aspectFill"
              class="comment-img-item"
              :class="[imgIndex !== 2 ? 'mr-r-20' : '']"
              :src="httpImg + img"
            />
          </div>
          <div
            class="communication-content mr-t-20"
            :class="[
              item.reply.length
                ? 'communication-content-bgf8'
                : 'communication-content-bgfff',
            ]"
          >
            <div v-for="(rowItem, rowIndex) in item.reply" :key="rowIndex">
              <div
                class="communication-item"
                v-if="
                  rowItemcommentType === 0 ||
                  rowItem.userno === rowItem.replyUserno
                "
              >
                <text @tap="handleClick('hf2', rowItem)" class="fz-13 fc-5d"
                  >{{ rowItem.nickName }}：</text
                >
                <text class="fz-13">{{ rowItem.componentInfo }}</text>
              </div>
              <div class="communication-item mr-t-10" v-else>
                <text class="fz-13 fc-5d" @tap="handleClick('hf2', rowItem)">{{
                  rowItem.nickName
                }}</text>
                <text class="fz-13 fc-5d mr-l-10">回复</text>
                <text
                  class="fz-13 fc-5d mr-l-10"
                  @tap="handleClick('hf3', rowItem)"
                  >{{ rowItem.replyName }}：</text
                >
                <text class="fz-13">{{ rowItem.componentInfo }}</text>
              </div>
            </div>
            <div class="huifu-box mr-t-10" @tap="handleClick('hf', item)">
              <text class="fz-13 fc-5d">回复</text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!componentList.length" class="fl-cen mr-t-30 mr-b-30">
      <div class="fz-12 fc-999">没有评论</div>
    </div>
    <div class="fl-cen all-comment-box" v-if="more" @tap="getMoreCom">
      <text class="fz-15 fc-999">查看更多评论</text>
      <text class="fz-15 fc-999 iconfont iconyoujiantou mr-l-10"></text>
    </div>
    <!-- 底部 操作栏 -->
    <div class="arc-bottom-content fl-bt">
      <div class="fl-co left-home-btn mr-l-30" @tap="handleClick('home')">
        <image class="left-home-img" src="../../static/tabar/home2.png" />
        <text class="fz-12">首页</text>
      </div>
      <div class="fl-cen right-opt-list mr-r-30">
        <div class="fl-al btn-widht-style" @tap.native.stop="handleClick('dz')">
          <text
            class="iconfont iconweibiaoti-- fz-16"
            v-if="atcObj.isPrais === 0"
          ></text>
          <text class="iconfont iconweibiaoti-- fz-16 fc-f1" v-else></text>
          <text class="fz-12 mr-l-6" v-if="atcObj.isPrais === 0">{{
            atcObj.smallPraisNum
          }}</text>
          <text class="fz-12 mr-l-6 fc-f1" v-else>{{
            atcObj.smallPraisNum
          }}</text>
        </div>
        <div class="fl-al btn-widht-style" @tap.native.stop="handleClick('sc')">
          <text
            class="iconfont iconshoucang fz-16"
            v-if="atcObj.isCollection === 0"
          ></text>
          <text class="iconfont iconshoucang fz-16 fc-f1" v-else></text>
          <text class="fz-12 mr-l-6" v-if="atcObj.isCollection === 0">{{
            atcObj.collectionNum
          }}</text>
          <text class="fz-12 mr-l-6 fc-f1" v-else>{{
            atcObj.collectionNum
          }}</text>
        </div>
        <div class="fl-al btn-widht-style" @tap.native.stop="getComHeight">
          <text class="iconfont iconpinglun fz-20"></text>
          <text class="fz-12 mr-l-2">{{ total }}</text>
        </div>
        <div class="fl-al btn-widht-style share-box-style">
          <text class="iconfont iconfenxiang fz-20"></text>
          <text class="fz-12 mr-l-2">{{
            atcObj.forward ? atcObj.forward : 0
          }}</text>
          <button class="share-btn-style" open-type="share"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const { toast, common } = require("../../utils/index");
const { atcImgUrl, userImgUrl } = require("../../config/develop");
export default {
  data() {
    return {
      commentType: false,
      commentHeight: 0,
      atcId: 0, // 文章id
      atcObj: {}, // 页面详情
      userInfo: {}, // 用户info
      commentForm: {
        componentType: 1,
        componentInfo: "",
        img: [],
        componentObj: "article",
        componentId: "",
        replyUserno: "",
      }, // 评论表单
      commentImgList: [], // 评论图片显示列表
      pageType: false, // 页面显示状态
      commentPlace: "", // 评论的默认文字
      hType: true, // 评论上传图片type
      textLength: 0, // 评论文字长度
      httpImg: atcImgUrl, // 图片显示
      userImgUrl: userImgUrl, // 图片显示
      pageNo: 1,
      pageSize: 10,
      componentList: [],
      total: 0,
      more: true,
      imgShowList: [],
      userNo: "",
      background: ["color1", "color2", "color3"],
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 500,
    };
  },
  async onLoad(obj) {
    this.userInfo = uni.getStorageSync("userInfo");
    this.userNo = uni.getStorageSync("userno");
    this.atcId = obj.id;
    await this.addBrowse();
    this.getAtcData();
    this.playerVideo();
  },
  onShareAppMessage() {
    this.$api.articleZc({
      aid: this.atcObj.id,
    });
    return {
      title: this.atcObj.title,
      path: `/subPackages/college/atcDetail?id=${this.atcObj.id}`,
    };
  },
  methods: {
    async addBrowse() {
      await this.$api.handleAddArticleBrowse({
        id: this.atcId,
        userno: this.userNo,
      });
    },
    playerVideo() {
      this.videoContext = uni.createVideoContext("myVideo");
      this.videoContext.play();
    },
    allPing() {
      this.videoContext.requestFullScreen();
    },
    // 获取文章
    async getCompotentData(id) {
      this.more = true;
      const { data } = await this.$api.getComponentPage({
        pageNo: 1,
        pageSize: this.pageSize * this.pageNo,
        componentObj: "article",
        componentId: id,
      });
      data.list.forEach((item) => {
        if (item.img) {
          item.img = item.img.split(",");
        } else {
          item.img = [];
        }
      });
      this.componentList = data.list;
      // this.componentList = this.componentList.concat(data.list);
      this.total = data.total;
      if (this.pageNo * this.pageSize >= this.total) this.more = false;
    },
    getMoreCom() {
      if (!this.more) return;
      this.pageNo++;
      this.getCompotentData(this.atcObj.id);
    },
    // 获取文章详情
    async getAtcData() {
      toast.showLoading("加载中");
      const { data } = await this.$api.getAtcInfo({
        id: this.atcId,
      });
      this.getCompotentData(data.id);
      this.atcObj = data;
      if (this.atcObj.imgs) this.imgShowList = this.atcObj.imgs.split(",");
      this.atcObj.contens = data.contens
        ? this.atcObj.contens.split("\n").join("<br/>")
        : "没有内容";
      uni.hideLoading();
      this.pageType = true;
    },
    // 上传图片
    async uploadImgComment() {
      if (this.commentForm.img.length === 3)
        return toast.showToast("只能上传三张图片");
      const data = await common.updataImg(3, "前台文章");
      this.commentImgList = [...this.commentImgList, ...data];
    },
    // 删除图片
    deleteImg(i) {
      this.commentImgList.splice(i, 1);
    },
    // 预览评论图片
    prewImgFunc(index, list) {
      let urlArr = [];
      list.forEach((item) => {
        urlArr.push(item.imgPath);
      });
      uni.previewImage({
        current: index,
        urls: urlArr,
        longPressActions: {},
      });
    },
    // 评论查看图片
    prewImgFunc2(index, list) {
      let urlArr = [];
      list.forEach((item) => {
        urlArr.push(this.httpImg + item);
      });
      uni.previewImage({
        current: index,
        urls: urlArr,
      });
    },
    // 发表评论
    async submitComment() {
      if (this.commentForm.componentInfo === "")
        return toast.showToast("评论内容不能为空");
      if (this.commentImgList.length) {
        let urlArr = [];
        this.commentImgList.forEach((item) => {
          urlArr.push(item.imgObj);
        });
        this.commentForm.img = urlArr.join(",");
      } else {
        this.commentForm.img = "";
      }
      toast.showLoading("发送中");
      await this.$api.atcPlRequest(this.commentForm);
      this.resetInput();
      this.more = true;
      const { data } = await this.$api.getComponentPage({
        pageNo: 1,
        pageSize: this.pageNo * this.pageSize,
        componentObj: "article",
        componentId: this.atcObj.id,
      });
      if (this.pageNo * this.pageSize >= this.total) this.more = false;
      data.list.forEach((item) => {
        if (item.img) {
          item.img = item.img.split(",");
        } else {
          item.img = [];
        }
      });
      this.commentType = false;
      this.componentList = data.list;
      uni.hideLoading();
    },
    // 重置评论form
    resetInput() {
      this.commentImgList = [];
      this.textLength = 0;
      this.commentForm = {
        componentType: 1,
        componentInfo: "",
        img: [],
        replyUserno: "",
        componentObj: "article",
        componentId: "",
      };
    },
    //  获取输入框高度
    getHeigth(val) {
      this.commentHeight = val.detail.height;
    },
    // 关闭评论弹框
    inputBlurChange() {
      this.resetInput();
      this.commentType = false;
    },
    // 评论文章弹框
    getComHeight() {
      if (!this.userNo) {
        uni.reLaunch({
          url: "/pages/page/login",
        });
        return;
      }
      this.commentForm.componentType = 1;
      this.commentForm.replyUserno = this.atcObj.userno;
      this.commentForm.componentId = this.atcObj.id;
      this.commentType = true;
      this.hType = true;
      this.commentForm.componentObj = "article";
      this.commentPlace = "想说些什么呢~（评论将在审核后显示）";
    },
    videoChange(e) {
      if (!e.detail.fullScreen) {
        this.playerType = false;
        this.videoContext.stop();
      }
    },
    userDetailNext(userno) {
      if (!this.userNo) {
        uni.reLaunch({
          url: "/pages/page/login",
        });
        return;
      }
      uni.navigateTo({
        url: `/subPackages/me/personDetails?userno=${userno}`,
      });
    },
    // 删除自己的评论
    deleteMyComment(row) {
      let that = this;
      uni.showModal({
        title: "删除评论",
        content: "是否删除?",
        success: async (res) => {
          if (res.confirm) {
            await that.$api.deleteAtcComment({
              commentId: row.id,
              currentUserNo: that.userNo,
            });
            that.getAtcData();
          } else if (res.cancel) {
            return;
          }
        },
      });
    },
    getText() {
      let arr = this.commentForm.componentInfo.split("");
      this.textLength = arr.length;
    },
    // 事件触发
    async handleClick(name, row) {
      switch (name) {
        // 关注
        case "gz": {
          if (!this.userNo) {
            this.more = true;
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          if (this.atcObj.userno === this.userInfo.userno) return;
          await this.$api.articleGz({
            idol: this.atcObj.userno,
            fans: this.userInfo.userno,
          });
          this.getAtcData();
          break;
        }
        // 取消关注
        case "qgz": {
          if (!this.userNo) {
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          await this.$api.articleCloseGz({
            currentUserNo: this.userInfo.userno,
            targetNo: this.atcObj.userno,
          });
          this.getAtcData();
          break;
        }
        case "dz": {
          if (!this.userNo) {
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          // 点赞
          let type = "";
          if (this.atcObj.isPrais !== 0) type = 1;
          await this.$api.articleDz({
            aid: this.atcObj.id,
            del: type,
          });
          this.getAtcData();
          break;
        }
        case "sc": {
          if (!this.userNo) {
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          // 收藏
          let type = "";
          if (this.atcObj.isCollection !== 0) type = 1;
          await this.$api.articleSc({
            aid: this.atcObj.id,
            del: type,
          });
          this.getAtcData();
          break;
        }
        // 返回首页
        case "home": {
          uni.switchTab({
            url: "/pages/page/home",
          });
          break;
        }
        // 评论回复
        case "hf": {
          if (!this.userNo) {
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          // 回复评论
          this.commentForm.componentType = 2;
          this.commentForm.componentId = row.id;
          this.commentForm.replyUserno = row.userno;
          this.commentForm.componentObj = "component";
          this.commentType = true;
          this.hType = false;
          this.commentPlace = `回复 ${row.nickName}`;
          break;
        }
        case "hf2": {
          if (!this.userNo) {
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          // 回复评论
          if (row.userno === this.userNo) {
            let that = this;
            uni.showModal({
              title: "删除评论",
              content: "是否删除?",
              success: async (res) => {
                if (res.confirm) {
                  await that.$api.deleteAtcComment({
                    commentId: row.id,
                    currentUserNo: that.userNo,
                  });
                  that.getAtcData();
                } else if (res.cancel) {
                  return;
                }
              },
            });
            return;
          }
          this.commentForm.componentType = 2;
          this.commentForm.componentId = row.componentId;
          this.commentForm.replyUserno = row.userno;
          this.commentForm.componentObj = "component";
          this.commentType = true;
          this.hType = false;
          this.commentPlace = `回复 ${row.nickName}`;
          break;
        }
        case "hf3": {
          if (!this.userNo) {
            uni.reLaunch({
              url: "/pages/page/login",
            });
            return;
          }
          if (row.replyUserno === this.userNo) {
            return;
          }
          // 回复评论
          this.commentForm.componentType = 2;
          this.commentForm.componentId = row.componentId;
          this.commentForm.replyUserno = row.replyUserno;
          this.commentForm.componentObj = "component";
          this.commentType = true;
          this.hType = false;
          this.commentPlace = `回复 ${row.replyName}`;
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
#atc-detail-container {
  padding-bottom: 140rpx;
}
.atc-detail-title {
  margin: auto;
  padding: 34rpx 0;
  width: 690rpx;
}
.atc-detail-content {
  margin: auto;
  width: 690rpx;
}
.video-style {
  width: 710rpx;
  height: 360rpx;
}
.atc-user-content {
  margin-top: 40rpx;
  width: 100%;
  height: 150rpx;
  background-color: #f8f8f8;
}
.follow-btn {
  width: 128rpx;
  height: 52rpx;
  border-radius: 26rpx 26rpx 26rpx 0;
  background-color: #7e6b5a;
}
.follow-btn2 {
  width: 128rpx;  
  height: 52rpx;
  border-radius: 26rpx 26rpx 26rpx 0;
  background-color: #999999;
}
.user-left-img {
  margin-right: 20rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.arc-bottom-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140rpx;
  background-color: #f8f8f8;
  z-index: 9999999;
}
.left-home-btn {
  width: 90rpx;
  height: 90rpx;
  border-radius: 10rpx;
  box-shadow: 0 0 2rpx #999999;
  background-color: #ffffff;
}
.right-opt-list {
  width: 490rpx;
  height: 90rpx;
  border-radius: 10rpx;
  box-shadow: 0 0 2rpx #999999;
  background-color: #ffffff;
}
.left-home-img {
  width: 38rpx;
  height: 38rpx;
}
.comment-content {
  padding: 20rpx 0 0 0;
  background-color: #ffffff;
}
.header-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.comment-item-box {
  padding-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f8f8f8;
}
.item-right-coentent {
  display: flex;
  flex-direction: column;
  margin-top: 18rpx;
  width: 610rpx;
}
.comment-img-item {
  margin-bottom: 6rpx;
  width: 156rpx;
  height: 156rpx;
  border-radius: 10rpx;
}
.communication-content {
  padding: 20rpx;
}
.communication-content-bgf8 {
  background-color: #f8f8f8;
}
.communication-content-bgfff {
  background-color: #ffffff;
}
.communication-item {
  line-height: 1.2;
}
.comment-title {
  margin: 30rpx 0 44rpx 0;
  padding: 0 30rpx;
}
.comment-content-input {
  margin-top: 2prpx;
  font-size: 28rpx;
  padding: 10rpx;
  border-radius: 10rpx;
  width: 670rpx;
  height: 250rpx;
  background-color: #ffffff;
}
.comment-box {
  padding: 30rpx 30rpx 0 30rpx;
  width: 100%;
  /* height: 90rpx; */
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  background-color: #ffffff;
  z-index: 999999999;
}
.comment-title-box {
  width: 100%;
  padding-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-bottom: 1px solid #cccccc;
}
.comment-icon-upload {
  width: 36rpx;
  height: 31rpx;
}
.comment-upload-img {
  position: relative;
  margin-right: 10rpx;
  width: 128rpx;
  height: 128rpx;
}
.upload-img-item {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}
.upload-img-delete {
  position: absolute;
  right: 0;
  top: 0;
  width: 30rpx;
  height: 30rpx;
  border-radius: 0 0 0 10rpx;
  background-color: #7e6b5a;
}
.zhezhao-bg {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 8888888;
  background-color: rgba(0, 0, 0, 0.6);
}
.comment-submit-btn {
  width: 750rpx;
  height: 108rpx;
  background: linear-gradient(to right, #333333, #666666);
}
.btn-widht-style {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25%;
}
.share-box-style {
  position: relative;
}
.share-btn-style {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.all-comment-box {
  padding: 20rpx 0;
  width: 100%;
  background-color: #f8f8f8;
}
.all-comment-box2 {
  padding: 10rpx 0;
  width: 100%;
}
.huifu-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.show-img-item {
  width: 100%;
  height: 100%;
}
.show-hide {
  display: none;
}
</style>