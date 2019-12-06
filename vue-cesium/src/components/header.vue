<template>
  <div style="width:100% :after">
    <div style="float:left;">
      <img src="../assets/logo.png" style="height:50px;margin-left:25px;" />
    </div>
    <div style="float:right;margin-right:200px;">
      <ctl-menu></ctl-menu>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import ctlMenu from "./controls/ctl-menu";
Vue.component("ctl-menu", ctlMenu);
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
</style>