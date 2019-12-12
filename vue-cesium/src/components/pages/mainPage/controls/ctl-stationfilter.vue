<template>
  <div>
    <div>
      <el-button @click="dialog.dialogVisible = true">站点查询</el-button>
    </div>

    <el-dialog
      v-if="dialog.dialogVisible"
      v-dialogDrag:{dialogDrag}="dialog.dialogDrag"
      ref="dialog__wrapper"
      :close-on-click-modal="false"
      :title="dialog.title"
      :visible.sync="dialog.dialogVisible"
      :before-close="handleClose"
      @close="handleFilterDialogClosed"
    >
      <div class="dialog-body">
        <div class="line">
          <transition name="fade" mode="out-in">
            <component :is="view" :list="selectedCity"></component>
          </transition>
        </div>
      </div>
      <slot slot="footer" class="dialog-footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ctlStationFilterByCategory from "./ctl-stationfilterbycategory";
import ctlStationResultList from "./ctl-stationResultList";
export default {
  components: {
    ctlStationFilterByCategory,
    ctlStationResultList
  },
  data() {
    return {
      selectedCity: [],
      dialog: {
        // dialog显示隐藏
        dialogVisible: false,
        dialogDrag: true, // 可拖拽
        title: "详情"
      },
      view: "ctl-StationFilter-ByCategory"
    };
  },
  created() {
    this.$bus.on("onStationFilterOkClick", result => {
      this.view = "ctl-Station-ResultList";
      this.dialog.title = "台站列表";
      this.selectedCity = result;
    });
  },
  methods: {
    handleClose(done) {
      //这里处理关闭前的提示
      done();
    },
    handleOnOkClick() {
      this.showfilter = false;
    },
    handleFilterDialogClosed() {
      this.view = "ctl-StationFilter-ByCategory";
    }
  }
};
</script>

<style scoped>
</style>