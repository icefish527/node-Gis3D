<template>
  <div style="width:100% :after">
    <div style="float:left;display:inline-block">
      <img src="../assets/logo.png" style="height:50px;margin-left:25px;" />
      <div style="display:inline-block">
        <ctl-menu></ctl-menu>
      </div>
    </div>
    <div style="float:right;margin-right:200px;">
      <ctl-Station-Filter></ctl-Station-Filter>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import ctlMenu from "./controls/ctl-menu";
import ctlStationFilter from "./controls/ctl-stationfilter";
Vue.component("ctl-menu", ctlMenu);
Vue.component("ctl-Station-Filter", ctlStationFilter);
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
</style>