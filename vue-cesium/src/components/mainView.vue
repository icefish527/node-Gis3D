<template>
  <div class="parent" id="parent" style="background-color: lightgrey;">
    <div class="background">
      <cesiumContainer></cesiumContainer>
    </div>
    <div class="top" style="background-color: rgb(84, 92, 100); border-bottom:solid 1px #e6e6e6">
      <Header></Header>
    </div>
    <div class="middleWrap" v-show="showUI">
      <div class="middle">
        <div class="left" style="background-color: rgba(255, 165, 0, 0.5);">
          <p>left</p>
          <!-- <v-distpicker
            :province="select.province"
            :city="select.city"
            :area="select.area"
            @selected="onSelected"
          ></v-distpicker>-->
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </div>
        <div class="right" style="background-color: #ffa07a7f;">
          <div class="right-in">
            <p>right</p>
            <websocket></websocket>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom" style="background-color: #90ee9085;">
      <p>bottom</p>
      <button @click="showAlert">showAlert</button>
      <button @click="allScreen">allScreen</button>
      <el-checkbox v-model="showUI">显示UI界面</el-checkbox>
    </div>
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
      showUI: false,
      options: regionDataPlus,
      selectedOptions: [
        TextToCode["北京市"].code,
        TextToCode["北京市"]["市辖区"].code,
        TextToCode["北京市"]["市辖区"]["朝阳区"].code
      ]
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
  width: 25%;
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