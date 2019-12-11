<template>
  <div class="wrap">
    <div class="left">
      <div class="logo">
        <img src="@/assets/logo.png" style />
      </div>
      <div class="menu-wrap">
        <ctl-menu></ctl-menu>
      </div>
    </div>
    <div class="right">
      <div class="station-filter-wrap">
        <ctl-Station-Filter></ctl-Station-Filter>
      </div>
      <div class="right-button-wrap">
        <el-button>全屏</el-button>
        <el-button>关闭</el-button>
      </div>
    </div>
    <div class="clearboth"></div>
  </div>
</template>
<script>
import Vue from "vue";
import ctlMenu from "./ctl-menu";
import ctlStationFilter from "./ctl-stationfilter";
export default {
  components: {
    ctlMenu,
    ctlStationFilter
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
$top-height: 50px;
.wrap {
  width: 100%;
}
.left {
  float: left;
  position: relative;
}
.right {
  float: right;
  position: relative;
  margin-right: 20px;
  padding-top: 5px;
  height: $top-height;
}
.clearboth {
  clear: both;
}
.logo {
  width: 200px;
  height: $top-height;
  margin-left: 25px;
  display: inline-block;
  overflow: hidden;
}
.logo img {
  margin: 0 auto;
  height: $top-height;
}
.menu-wrap {
  margin-left: 20px;
  display: inline-block;
}
@mixin right-wrap {
  display: inline-block;
}
.station-filter-wrap {
  @include right-wrap;
}
.right-button-wrap {
  @include right-wrap;
}
</style>