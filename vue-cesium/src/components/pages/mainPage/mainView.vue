<template>
  <div class="parent" id="parent" style="background-color: lightgrey;">
    <div class="background">
      <cesiumContainer></cesiumContainer>
    </div>
    <div class="top">
      <Header></Header>
    </div>
    <div class="middleWrap" v-show="showUI">
      <div class="middle">
        <div class="left" style="background-color: rgba(255, 165, 0, 0.2);">
          <p>left</p>
          <websocket></websocket>
          <div>
            <el-checkbox v-model="showUI">显示UI界面</el-checkbox>
          </div>
          <div>
            <el-button type="text" @click="dialog.dialogVisible = true">打开Dialog</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Header from "./controls/header";
import cesiumContainer from "./controls/cesiumContainer";
import websocket from "./controls/websocket";
export default {
  name: "mainView",
  components: {
    cesiumContainer,
    Header,
    websocket
  },
  data() {
    return {
      showUI: true
    };
  },
  methods: {
    showAlert: function() {
      // show message with close callback and options
      this.$dlg.toast(
        "you got a new message!",
        function() {
          //toast close callback
        },
        {
          messageType: "warning",
          closeTime: 3 // auto close dialog time(second)
        }
      );
    },
    allScreen() {
      this.showUI = false;
    }
  },
  mounted() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body,
p {
  margin: 0;
}
body,
html,
.parent {
  height: 100%;
}
.background {
  position: absolute;
  height: 100%;
  width: 100%;
  /* top: 50px; */
  /* bottom: 50px; */
}

.top,
.bottom {
  position: absolute;
  height: 50px;
  left: 0;
  right: 0;
}
.top {
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.bottom {
  bottom: 0;
}
.middleWrap {
  height: 100%;
  overflow: hidden;
}
.middle {
  overflow: hidden;
  height: 100%;
  margin: 50px 0;
}
.left {
  float: left;
  position: relative;
  width: 400px;
  height: 100%;
}
.right {
  float: right;
  position: relative;
  overflow: auto;
  width: 25%;
  height: 100%;
}
.right-in {
  height: 100%;
}
</style>