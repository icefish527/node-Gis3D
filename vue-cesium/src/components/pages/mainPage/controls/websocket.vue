<template>
  <div>{{msg}}</div>
</template>

 

<script>
import longSock from "@/util/longSock";
let wssCenter;

export default {
  name: "websocket",
  data() {
    return {
      websock: null,
      msg: ""
    };
  },

  created() {
    //页面刚进入时开启长连接
    //this.initWebSocket();
    wssCenter = new longSock("ws://127.0.0.1:4000/", this.handler, "longsock");
    //this.handler = this.handler.bind(this);
  },

  destroyed: function() {
    //页面销毁时关闭长连接
    wssCenter.close(); //断开连接
  },

  methods: {
    handler(evt, ws) {
      //evt 是 websockett数据
      //ws 是请求名称，方便关闭websocket
      console.log(evt.data);
      this.msg = evt.data;
    }
  }
};
</script>