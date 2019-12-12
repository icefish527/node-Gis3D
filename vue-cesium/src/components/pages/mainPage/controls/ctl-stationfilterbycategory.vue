<template>
  <div>
    <div>
      <span>所在区域</span>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div>
      <el-button @click="handleOKClick">确定</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
const cityOptions = ["东城区", "西城区", "朝阳区", "海淀区", "大兴区"];
export default {
  data() {
    return {
      checkAll: false,
      checkedCities: ["海淀区", "大兴区"],
      cities: cityOptions,
      isIndeterminate: true
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleOKClick() {
      this.$bus.emit("onStationFilterOkClick", this.checkedCities);
    }
  }
};
</script>

<style scoped>
</style>