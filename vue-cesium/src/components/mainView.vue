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
          <!-- <v-distpicker
            :province="select.province"
            :city="select.city"
            :area="select.area"
            @selected="onSelected"
          ></v-distpicker>-->
          <websocket></websocket>
          <el-checkbox v-model="showUI">显示UI界面</el-checkbox>
          <el-button type="text" @click="dialog.dialogVisible = true">打开Dialog</el-button>
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="dialog.dialogVisible"
      v-dialogDrag:{dialogDrag}="dialog.dialogDrag"
      v-dialogChange:{dialogChange}="dialog.dialogChange"
      ref="dialog__wrapper"
      :close-on-click-modal="false"
      :title="dialog.title"
      :visible.sync="dialog.dialogVisible"
      :before-close="handleClose"
    >
      <div class="dialog-body">
        <div class="line">
          <slot name="content"></slot>
        </div>
      </div>
      <slot slot="footer" class="dialog-footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import Header from "./header";
Vue.component("Header", Header);
import cesiumContainer from "./cesiumContainer.vue";
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import websocket from "./controls/websocket";
Vue.component("websocket", websocket);
export default {
  name: "mainView",
  data() {
    return {
      select: { province: "广东省", city: "广州市", area: "海珠区" },
      showUI: true,
      options: regionDataPlus,
      selectedOptions: [
        TextToCode["北京市"].code,
        TextToCode["北京市"]["市辖区"].code,
        TextToCode["北京市"]["市辖区"]["朝阳区"].code
      ],
      dialog: {
        // dialog显示隐藏
        dialogVisible: false,
        dialogDrag: true, // 可拖拽
        dialogChange: true, // 可拉伸
        title: "详情"
      }
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
    onSelected(data) {
      //alert(data.province.value + " | " + data.city.value + " | " + data.area.value);
      console.log(data);
    },
    allScreen() {
      this.showUI = false;
    },
    handleChange(val) {
      console.log(CodeToText[val[0]]);
      console.log(CodeToText[val[1]]);
      console.log(CodeToText[val[2]]);
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