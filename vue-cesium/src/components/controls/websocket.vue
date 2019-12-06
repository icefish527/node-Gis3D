<template>
  <div>{{msg}}</div>
</template>

 

<script>
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
    this.initWebSocket();
  },

  destroyed: function() {
    //页面销毁时关闭长连接
    this.websocketclose();
  },

  methods: {
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://192.168.80.128:4000/"; //ws地址
      this.$websocket = new WebSocket(wsuri);
      this.$websocket.onopen = this.websocketonopen;
      this.$websocket.onerror = this.websocketonerror;
      this.$websocket.onmessage = this.websocketonmessage;
      this.$websocket.onclose = this.websocketclose;
    },

    websocketonopen() {
      console.log("WebSocket连接成功");
      let _this =this;
    //   setInterval(function() {
    //     _this.websocketsend("客户端发送消息" + Math.random().toFixed(2));
    //   }, 500);
    },

    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },

    websocketonmessage(e) {
      //数据接收
      console.log(e);
      this.msg = e.data;
    },

    websocketsend(agentData) {
      //数据发送
      this.$websocket.send(agentData);
    },

    websocketclose(e) {
      //关闭

      console.log("connection closed (" + e.code + ")");
    }
  }
};
</script>