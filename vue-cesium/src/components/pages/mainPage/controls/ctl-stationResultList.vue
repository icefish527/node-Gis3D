<template>
  <div>
    <el-table
      :data="tableData"
      :highlight-current-row="true"
      style="width: 100%"
    >
      <el-table-column label="站点" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.stationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>经度: {{ scope.row.longItude }}</p>
            <p>纬度: {{ scope.row.latItude }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.stationNum }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "@/js/api/api";
export default {
  props: ["list"],
  watch: {
    list: function(newValue) {
      console.log(newValue); //可以看到数据已经拿到
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  created() {
    // this.$bus.on("onStationFilterOkClick", resultList => {
    //   console.log(resultList);
    // });
  },
  mounted() {
    let querylist = this.$props["list"];
    console.log(querylist);
    this.getStations(querylist);
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    getStations(querylist) {
      let _this = this;
      let params = {
        stationNum: "54511"
      };
      api.station.getStations(params).then(data => {
        let stations = [];
        data.RECORDS.forEach(function(info, infoIndex) {
          stations.push({
            id: info["id"],
            stationName: info["stationName"],
            stationNum: info["stationNum"],
            type: info["type"],
            lon: info["longItude"],
            lat: info["latItude"],
            alt: 0
          });
        });
        _this.tableData = stations;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-header-row {
  background-color: yellowgreen;
}
</style>