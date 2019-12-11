<template>
  <div style="width:100% :after">
    <div style="float:left;">
      <img src="@/assets/logo.png" style="height:50px;margin-left:25px;display:inline-block" />
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
<style scoped>
</style>