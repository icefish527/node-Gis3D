<template>
  <div>
    <div>
      <el-button type="text" @click="dialog.dialogVisible = true">filter</el-button>
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
          <ctl-StationFilter-ByCategory></ctl-StationFilter-ByCategory>
        </div>
      </div>
      <slot slot="footer" class="dialog-footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ctlStationFilterByCategory from "./ctl-stationfilterbycategory";
Vue.component("ctl-StationFilter-ByCategory", ctlStationFilterByCategory);
export default {
  data() {
    return {
      selectedCity: [],
      dialog: {
        // dialog显示隐藏
        dialogVisible: false,
        dialogDrag: true, // 可拖拽
        dialogChange: true, // 可拉伸
        title: "详情"
      }
    };
  }
};
</script>

<style scoped>
</style>