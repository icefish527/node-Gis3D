<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#00000000"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="max-height:50px;"
  >
    <el-menu-item index="1">告警</el-menu-item>
    <el-menu-item index="2">
      <template slot="title">一览图</template>
    </el-menu-item>
    <el-submenu index="3">
      <template slot="title">天气模拟</template>
      <el-menu-item index="3-1">雨</el-menu-item>
      <el-menu-item index="3-2">雪</el-menu-item>
      <el-menu-item index="3-3">雾</el-menu-item>
      <el-menu-item index="3-4">风</el-menu-item>
      <el-menu-item index="3-0">取消</el-menu-item>
    </el-submenu>
    <el-menu-item index="4">
      <template slot="title">全屏</template>
    </el-menu-item>
    <el-menu-item index="5">
      <template slot="title">退出</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      let _this = this;
      console.log(key, keyPath);
      //this.$store.dispatch("sendShowRain","");
      if (keyPath[0] === "3") {
        let weatherStr;
        switch (key) {
          case "3-1":
            weatherStr = "雨";
            break;
          case "3-2":
            weatherStr = "雪";
            break;
          case "3-3":
            weatherStr = "雾";
            break;
          case "3-4":
            weatherStr = "风";
            break;
          case "3-0":
            weatherStr = null;
            break;
          default:
            weatherStr = null;
            break;
        }
        this.$bus.emit("onWeatherMenuSelect", weatherStr);
      }
    }
  },
  state: {},
  mutations: {
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    }
  },
  actions: {
    // getPermissions({commit, dispatch}) {
    //   queryPermissions().then(res => {
    //     sessionStorage.setItem('permissions', JSON.stringify(res))
    //     this.dispatch('setPermissions', res); // 调本module里的方法
    //   })
    // },
    sendShowRain({ commit, dispatch, state, rootState }, data) {
      //commit('SET_PERMISSIONS', data); // 本module的commit
      dispatch("onShowRainClick", data); // 调menu里的方法
      //console.log(rootState.menu.menus); // 取menu里的参数
    }
  }
};
</script>

<style>
.el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 50px;
}
/* 水平菜单顶层菜单样式 */
/* >符号表示直接孩子，.el-menu--horizontal>.el-submenu .el-submenu_title表示的
  是类.el-menu--horizontal元素（这个是顶层菜单el-menu）下的第一层元素（sub-menu）下的标题，
  这个标题是放在<i>元素的slot属性中的，从而找到了<i>元素，修改它的样式就可以了 */
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px;
  line-height: 50px;
  border-bottom: 2px solid transparent;
}
/* 水平菜单子菜单的标题（注意，标题和菜单项不一样，标题是使用<i slot="title">表示的，需要单独处理），
  这里使用.el-submenu>.el-submenu_title定位到子菜单（不是菜单项） */
.el-menu--horizontal .el-menu .el-submenu > .el-submenu__title {
  float: none;
  height: 33px;
  line-height: 33px;
}
/* 水平菜单子菜单中的所有菜单项 */
.el-menu--horizontal .el-menu .el-menu-item {
  float: none;
  height: 33px;
  line-height: 33px;
  width: auto;
}
</style>