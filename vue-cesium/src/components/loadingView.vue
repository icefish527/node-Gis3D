<template>
  <div class="fullsize">
    <!-- <img alt src="@/assets/images/loading_earth500x500.gif" /> -->
    <video src="@/assets/videos/loading.mp4" autoplay="autoplay" loop="loop" muted="muted" />
    <div class="progressContainer">
      <el-progress
        :percentage="percentage"
        :color="customColorMethod"
        stroke-width="2"
        show-text="false"
      />
      <div>
        <p class="percentText">{{percentage}}%</p>
        <p class="stateText">{{loadingState}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  name: "loading-view",
  data() {
    return {
      percentage: 20,
      loadingState: "正在启动..."
    };
  },
  mounted() {
    this.pageLoaded();
  },
  methods: {
    pageLoaded() {
      setInterval(() => {
        if (this.percentage === 100) {
          this.loadingState = "加载完成 ！";
          setTimeout(() => {
            router.push("index");
          }, 1000);
          return;
        }
        this.percentage += 1;
      }, 100);
    },
    customColorMethod(percentage) {
      let alpha = 0.2 + 0.8 * (percentage / 100);
      return "rgba(64,158,255," + alpha + ")";
    }
  }
};
</script>

<style scoped>
.fullsize {
  width: 100%;
  height: 100%;
  margin: 0;
  background: black;
}
.progressContainer {
  position: absolute;
  bottom: 10px;
  width: 100%;
}
.progressContainer .percentText {
  margin: 0;
  color: white;
  text-align: center;
  font-size: 24px;
}
.progressContainer .stateText {
  margin: 0;
  color: white;
  text-align: center;
  font-size: 24px;
  margin-left: 20px;
}
</style>
<style>
.el-progress-bar {
  padding-right: 0px;
}
.el-progress__text {
  display: none;
}
.el-progress-bar__outer {
  background-color: rgba(235, 238, 245, 0.2);
}
</style>