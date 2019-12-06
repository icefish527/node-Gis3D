<template>
  <div class="fullSize">
    <div id="cesiumContainer" class="fullSize"></div>
    <div id="creditContainer" style="display: none;"></div>
    <div style="position: absolute;right: 10px;bottom: 50px;width:300px;line-height: 2">
      <button @click="showSnow()">显示雪</button>
      <button @click="showRain()">显示雨</button>
      <button @click="showFog()">显示雾</button>
      <button @click="removeStage()">取消气象</button>
      <button @click="showCloud()">显示云图</button>
      <button @click="showCloud(false)">隐藏云图</button>
      <button @click="DrawWindy()">显示风场</button>
      <button @click="enableLighting()">开启晨昏线</button>
      <button @click="enableLighting(false)">关闭晨昏线</button>
      <button @click="earthAutoRotateStart()">开始自转</button>
      <button @click="earthAutoRotateStop()">停止自转</button>
      <input type="text" id="txtPosition" v-model="position" value="40,116.5,300000" />
      <button @click="Flyto(position)">定位</button>
      <button @click="AddCircleRipple()">添加环形波纹</button>
      <button @click="AddODLine()">添加OD线</button>
      <button @click="AddRectSensor()">添加矩形传感器</button>
      <button @click="AddBlueBuilding()">添加蓝色建筑</button>
      <button @click="RemoveBlueBuilding()">删除蓝色建筑</button>
      <button @click="AddWhiteBuilding()">添加白色建筑</button>
      <button @click="RemoveWhiteBuilding()">删除白色建筑</button>
      <button @click="loadShuiti()">显示水体</button>
      <button @click="removeShuiti()">隐藏水体</button>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
// noinspection ES6UnusedImports
import widgets from "cesium/Widgets/widgets.css";
import api from "@/js/api/api";
import Particle from "../plugins/wind/Particle.js";
import WindField from "../plugins/wind/WindField.js";
import Windy from "../plugins/wind/Windy.js";
import polylineTrail from "../plugins/polylineTrail.js";
import ysccss from "../plugins/ysc/css/ysc.css";
import ysc from "../plugins/ysc/ysc.js";
let Cesium3DViewer;
let cloudLayer;

let AllLayersDic = new Array();
///tooltip
let TooltipDiv = (function() {
  var isInit = false;

  function _() {}

  _.initTool = function(frameDiv) {
    if (isInit) {
      return;
    }

    var div = document.createElement("DIV");
    div.className = "tooltipdiv right"; //

    var arrow = document.createElement("DIV");
    arrow.className = "tooltipdiv-arrow";
    div.appendChild(arrow);

    var title = document.createElement("DIV");
    title.className = "tooltipdiv-inner";
    div.appendChild(title);

    this._div = div;
    this._title = title;

    frameDiv.appendChild(div);

    isInit = true;
  };

  _.setVisible = function(visible) {
    if (!isInit) {
      return;
    }
    this._div.style.display = visible ? "block" : "none";
  };

  _.showAt = function(position, message) {
    if (!isInit) {
      return;
    }
    if (position && message) {
      this.setVisible(true);
      this._title.innerHTML = message;
      this._div.style.left = position.x + 10 + "px";
      this._div.style.top = position.y - this._div.clientHeight / 2 + "px";
    }
  };

  return _;
})();
///tooltip

let loactionTectEntity;

//影像底图切换
let img_tdt_yx = new Cesium.ProviderViewModel({
  name: "影像底图",
  tooltip: "影像底图",
  //显示切换的图标
  iconUrl: require("../assets/images/img_tdt_yx.png"),
  creationFunction: function() {
    var esri = new Cesium.WebMapTileServiceImageryProvider({
      url:
        "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=7711a24780452f03bb7c02fba98183b9",
      maximumLevel: 18
    });
    //影像标注
    return esri;
  }
});

//矢量底图切换
let img_tdt_sl = new Cesium.ProviderViewModel({
  name: "矢量底图",
  tooltip: "矢量底图",
  iconUrl: require("../assets/images/img_tdt_sl.png"),
  creationFunction: function() {
    var esri = new Cesium.WebMapTileServiceImageryProvider({
      url:
        "http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=7711a24780452f03bb7c02fba98183b9",
      maximumLevel: 18
    });
    return esri;
  }
});

//地形底图切换
let img_tdt_dx = new Cesium.ProviderViewModel({
  name: "地形底图",
  tooltip: "地形底图",
  iconUrl: require("../assets/images/img_tdt_dx.png"),
  creationFunction: function() {
    var esri = new Cesium.WebMapTileServiceImageryProvider({
      url:
        "http://t0.tianditu.gov.cn/ter_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ter&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=7711a24780452f03bb7c02fba98183b9",
      maximumLevel: 18
    });
    return esri;
  }
});

//藏青街道底图切换
let img_googlestreet_zq = new Cesium.ProviderViewModel({
  name: "藏青街道",
  tooltip: "藏青街道",
  //显示切换的图标
  iconUrl: require("../assets/images/img_tdt_yx.png"),
  creationFunction: function() {
    var esri = new Cesium.createTileMapServiceImageryProvider({
      url: "http://192.168.2.119:10080/googlestreet10bluegreen",
      maximumLevel: 10
    });
    //影像标注
    return esri;
  }
});

//藏蓝街道底图切换
let img_googlestreet_zl = new Cesium.ProviderViewModel({
  name: "藏蓝街道",
  tooltip: "藏蓝街道",
  //显示切换的图标
  iconUrl: require("../assets/images/img_tdt_yx.png"),
  creationFunction: function() {
    var esri = new Cesium.createTileMapServiceImageryProvider({
      url: "http://192.168.2.119:10080/googlestreet10blue",
      maximumLevel: 10
    });
    //影像标注
    return esri;
  }
});

//原色街道底图切换
let img_googlestreet = new Cesium.ProviderViewModel({
  name: "原色街道",
  tooltip: "原色街道",
  //显示切换的图标
  iconUrl: require("../assets/images/img_tdt_yx.png"),
  creationFunction: function() {
    var esri = new Cesium.createTileMapServiceImageryProvider({
      url: "http://192.168.2.119:10080/googlestreet10",
      maximumLevel: 10
    });
    //影像标注
    return esri;
  }
});

let blackMarble;
let river;
let lastStage;
let rotate;
let buildingTilesetBlue;
let buildingTilesetWhite;
let windy;
let timer;

export default {
  name: "cesiumContainer",
  data() {
    return {
      position: "40,116.5,300000"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.cesiumInit();
    });
  },
  methods: {
    cesiumInit() {
      var viewer = new Cesium.Viewer("cesiumContainer", {
        contextOptions: {
          webgl: {
            alpha: true,
            depth: false,
            stencil: true,
            antialias: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: true
          },
          allowTextureFilterAnisotropic: true
        },
        animation: false, //是否创建动画小器件，左下角仪表
        timeline: false, //是否显示时间轴
        sceneModePicker: false, //是否显示3D/2D选择器
        baseLayerPicker: true, //是否显示图层选择器
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        imageryProviderViewModels: [
          img_tdt_yx,
          img_tdt_dx,
          img_tdt_sl,
          img_googlestreet_zq,
          img_googlestreet_zl,
          img_googlestreet
        ], //可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        selectedImageryProviderViewModel: img_googlestreet_zq, //当前地形图层的显示模型，仅baseLayerPicker设为true有意
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        homeButton: true, //是否显示Home按钮
        fullscreenButton: false,
        infoBox: true, //是否显示信息框
        showRenderLoopErrors: false //如果设为true，将在一个HTML面板中显示错误信息
      });
      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.showGroundAtmosphere = true;
      viewer.scene.highDynamicRange = true;
      Cesium3DViewer = viewer;
      //影像标注
      this.addImageryProvider(
        "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=7711a24780452f03bb7c02fba98183b9"
      );

      var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
        //url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
        //url: 'https://assets02.agi.com/stk-terrain/v1/tilesets/world/tiles',
        url: "http://192.168.2.119:10081/terrain",
        //requestWaterMask: true,
        requestVertexNormals: true
      });
      viewer.scene.globe.terrainProvider = cesiumTerrainProviderMeshes;
      // viewer.scene.primitives.add(new Cesium3DTileset({
      //     url: 'http://127.0.0.1:10081/3DTiles/dytqx3dtiles/tileset.json' //   ./data/3dtiles-lab/tileset.json
      // }));
      // viewer.scene.primitives.add(new Cesium3DTileset({
      //     url: 'http://192.168.2.119:10081/3DTiles/blds3dtiles/tileset.json' //   ./data/3dtiles-lab/tileset.json
      // }));

      //太阳光晕
      var lensFlare = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createLensFlareStage()
      );

      function updatePostProcess() {
        var viewModel = {
          show: true,
          intensity: 2.0, //4.0,
          distortion: 20.0, //20.0,
          dispersion: 0.4, //0.4,
          haloWidth: 0.6 //0.4
        };
        lensFlare.enabled = Boolean(viewModel.show);
        lensFlare.uniforms.intensity = Number(viewModel.intensity);
        lensFlare.uniforms.distortion = Number(viewModel.distortion);
        lensFlare.uniforms.ghostDispersal = Number(viewModel.dispersion);
        lensFlare.uniforms.haloWidth = Number(viewModel.haloWidth);
        lensFlare.uniforms.earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
      }
      updatePostProcess();
      //太阳光晕

      //取消双击事件
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      let _this = this;
      // Override behavior of home button
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function(commandInfo) {
          // Fly to custom position
          _this.viewHome();
          // Tell the home button not to do anything
          commandInfo.cancel = true;
        }
      );
      TooltipDiv.initTool(viewer.cesiumWidget.container);
      //一 鼠标MOUSE_MOVE
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function(e) {
        var picked = viewer.scene.pick(e.endPosition);
        // if (picked) {
        //     var id = defaultValue(picked.id, picked.primitive.id);
        //     if (id instanceof Entity) {
        //         return id;
        //     }
        // }

        if (picked) {
          if (typeof picked.id != "undefined") {
            TooltipDiv.showAt(e.endPosition, picked.id.name);
          }
        } else {
          TooltipDiv.setVisible(false);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      AllLayersDic["定期检验"] = new Map();
      Cesium3DViewer.cesiumWidget.screenSpaceEventHandler.setInputAction(
        function(e) {
          var entity = pickEntity(Cesium3DViewer, e);
          if (entity) {
            AllLayersDic["定期检验"].forEach(function(info, infoindex) {
              if (info.id == entity.id) {
                EntyClick(entity, e);
              }
            });
          }
          var earthPosition = viewer.scene.pickPosition(e.position);
          var ellipsoid = viewer.scene.globe.ellipsoid;
          var cartesian3 = new Cesium.Cartesian3(
            earthPosition.x,
            earthPosition.y,
            earthPosition.z
          );
          var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var lng = Cesium.Math.toDegrees(cartographic.longitude);
          var alt = cartographic.height;
          console.log(
            "点击坐标：" + "lat:" + lat + " lng:" + lng + " alt:" + -alt
          );
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );

      //地球坐标拾取，支持地形
      // Cesium3DViewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function (e) {
      //     var earthPosition = viewer.scene.pickPosition(e.position);
      //     var ellipsoid = viewer.scene.globe.ellipsoid;
      //     var cartesian3 = new Cartesian3(earthPosition.x, earthPosition.y, earthPosition.z);
      //     var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      //     var lat = Math.toDegrees(cartographic.latitude);
      //     var lng = Math.toDegrees(cartographic.longitude);
      //     var alt = cartographic.height;
      //     console.log("点击坐标：" + "lat:" + lat + " lng:" + lng + " alt:" + -alt);
      // }, ScreenSpaceEventType.LEFT_CLICK);

      function defaultValue(obj, value) {
        if (!obj) return value;
        else return obj;
      }

      function pickEntity(viewer, e) {
        var picked = viewer.scene.pick(e.position);
        if (picked) {
          var id = defaultValue(picked.id, picked.primitive.id);
          if (id instanceof Cesium.Entity) {
            return id;
          }
        }
      }

      var EntyClick = function(entity, e) {
        var msg = entity.datacontext;
        var jsonStr = JSON.stringify(msg);
        console.log(msg);
        bound.myMethod(jsonStr);
        //PubSub.publish('MenuManagerSelectedItem3D', entity);
        // 设置更新周期
        //SetMenuPosion(e.position);
        // MyInterval= setInterval(function () {
        //   RefreshDongHua(entity);
        // }, 300);
      };
      this.showCloud();
      this.Flyto("39.333,115.333,5000000");
      setTimeout(this.viewHome, 3000);
      //viewHome();
      this.queryJianCeZhanAddToMap();
      /**
       * 设置后当相机高度达到设置的最大和最小高度时将不再放大和缩小
       */
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2000; //相机的高度的最小值
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000; //相机高度的最大值
      viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
      viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000; //设置相机放大时的速率
    },

    viewHome() {
      // 默认东半球的rectangle，用于viewHome时自动定位到东半球
      //设置homebutton的位置
      var DEFAULT_EASTERN_RECTANGLE = Cesium.Rectangle.fromDegrees(
        116.21014061119186,
        39.7408582858915,
        116.60006859950693,
        40.05749442116935
      );

      if (loactionTectEntity == undefined) {
        loactionTectEntity = Cesium3DViewer.entities.add({
          name: "locationRectangle",
          id: "locationRectangle",
          rectangle: {
            coordinates: DEFAULT_EASTERN_RECTANGLE,
            material: Cesium.Color.GREEN.withAlpha(0.0),
            height: 10.0,
            outline: false
          }
        });
      }
      Cesium3DViewer.trackedEntity = undefined;
      var scene = Cesium3DViewer.scene;
      var duration = 1.5;
      var mode = scene.mode;

      if (scene && mode === Cesium.SceneMode.MORPHING) {
        scene.completeMorph();
      }
      if (mode === Cesium.SceneMode.SCENE3D) {
        var destination = scene.camera.getRectangleCameraCoordinates(
          DEFAULT_EASTERN_RECTANGLE
        );
        var mag = Cesium.Cartesian3.magnitude(destination);
        mag += mag * Cesium.Camera.DEFAULT_VIEW_FACTOR;
        Cesium.Cartesian3.normalize(destination, destination);
        Cesium.Cartesian3.multiplyByScalar(destination, mag, destination);

        var flyPromise = Cesium3DViewer.flyTo(loactionTectEntity, {
          duration: 3,
          offset: new Cesium.HeadingPitchRange(
            0.0,
            Cesium.Math.toRadians(-30.0)
          )
        });
      }
    },

    queryJianCeZhanAddToMap(params = null) {
      params = {
        stationNum: "54511"
      };
      api.station.getStations(params).then(data => {
        let stations = [];
        data.RECORDS.forEach(function(info, infoIndex) {
          stations.push({
            id: info["id"],
            stationName: info["stationName"],
            type: info["type"],
            lon: info["longItude"],
            lat: info["latItude"],
            alt: 0
          });
        });
        this.addStationToMap(stations);
      });
      // let _this = this;
      // let s = new Promise((resolve, reject) => {
      //   params = {
      //     stationNum: "54511"
      //   };
      //   _this.$ajax.get("stations", params).then(data => {
      //     let stations = [];
      //     data.RECORDS.forEach(function(info, infoIndex) {
      //       stations.push(() => {
      //         new {
      //           id: info["id"],
      //           stationName: info["stationName"],
      //           type: info["type"],
      //           lon: info["longItude"],
      //           lat: info["latItude"],
      //           alt: 0
      //         }();
      //       });
      //     });
      //     //   $.ajaxSettings.async = true;
      //   });
      // });
    },

    addStationToMap(stations) {
      stations.forEach(function(info, infoIndex) {
        let station = info;
        var imageurl = "images/tubiao/检测站.png";

        //var pollutionCount = Math.ceil(Math.random() * 10);
        if (station.type == 0) {
          imageurl = require("../assets/images/tubiao/检测站-绿.png");
        } else if (
          station.type == 3 ||
          station.type == 4 ||
          station.type == 5
        ) {
          imageurl = require("../assets/images/tubiao/检测站-黄.png");
        } else if (
          station.type == 1 ||
          station.type == 2 ||
          station.type == 6
        ) {
          imageurl = require("../assets/images/tubiao/检测站-红.png");
        }

        if (station.lon == null || station.lat == null) {
          return;
        }
        var origin = Cesium.Cartesian3.fromDegrees(station.lon, station.lat, 0);
        var jiancezhan = Cesium3DViewer.entities.add({
          id: station.id,
          name: station.stationName,
          datacontext: station,
          show: true,
          position: origin,
          billboard: {
            image: imageurl,
            scale: 0.4,
            show: true,
            material: Cesium.Color.BLUE,
            pixelOffset: new Cesium.Cartesian2(0, 0)
          },
          label: {
            text: station.stationName,
            font: "10pt monospace",
            scale: 1,
            backgroundColor: new Cesium.Color(0, 0, 0, 0.5), //背景颜色
            showBackground: true, //是否显示背景颜色
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 0,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, 40)
          },
          model: {
            uri: "/Cesium/SampleData/models/WoodTower/Wood_Tower.gltf"
          }
        });
        AllLayersDic["定期检验"].set(station.id, jiancezhan);
      });
    },

    //影像标注加载
    addImageryProvider(url) {
      Cesium3DViewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: url,
          layer: "tdtImgAnnoLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
    },

    showCloud(enable = true) {
      if (enable) {
        cloudLayer = Cesium3DViewer.imageryLayers.addImageryProvider(
          new Cesium.SingleTileImageryProvider({
            url: "/Cesium/SampleData/CloudOneImage.png"
            //maximumLevel : 8,
          })
        );
        cloudLayer.alpha = 0.5;
      } else {
        Cesium3DViewer.imageryLayers.remove(cloudLayer);
      }
    },

    enableLighting(enable = true) {
      Cesium3DViewer.scene.globe.enableLighting = enable;
      if (enable) {
        blackMarble = Cesium3DViewer.imageryLayers.addImageryProvider(
          new Cesium.SingleTileImageryProvider({
            url: "/Cesium/SampleData/LightingOneImage.jpg"
          })
        );
        blackMarble.alpha = 0.5;
        blackMarble.brightness = 2.0;
      } else {
        Cesium3DViewer.imageryLayers.remove(blackMarble);
      }
    },

    loadShuiti() {
      if (!river) {
        let s = new Promise((resolve, reject) => {
          this.$ajax
            .get("/data/shuiti/st.json", null)
            .then(data => {
              //console.log(data);
              var instances = [];
              data.geometries.forEach(function(info, infoIndex) {
                var coordinates = info["coordinates"];
                var c3s = [];
                var coor = coordinates[0];
                for (var i = 0; i < coor.length; i++) {
                  //datas.length
                  c3s.push(coor[i][0]);
                  c3s.push(coor[i][1]);
                  //c3s.push(1500+i*10);
                }

                var waterFace = Cesium.Cartesian3.fromDegreesArray(c3s); //单位：度，度，米
                var geometry = new Cesium.PolygonGeometry({
                  polygonHierarchy: new Cesium.PolygonHierarchy(waterFace),
                  //extrudedHeight: 500,
                  //perPositionHeight: true,
                  height: 0
                });
                instances.push(
                  new Cesium.GeometryInstance({
                    geometry: new Cesium.PolygonGeometry({
                      polygonHierarchy: new Cesium.PolygonHierarchy(waterFace),
                      vertexFormat:
                        Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                    }),
                    // geometry: new RectangleGeometry({
                    //     rectangle: Rectangle.fromDegrees(-100.0, 30.0, -90.0, 40.0)
                    // }),
                    attributes: {
                      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                        Cesium.Color.RED
                      )
                    }
                  })
                );
              });

              river = new Cesium.Primitive({
                geometryInstances: instances,
                // 可以设置内置的水面shader
                // appearance: new EllipsoidSurfaceAppearance({
                //     aboveGround: true
                // }),
                appearance: new Cesium.EllipsoidSurfaceAppearance({
                  material: new Cesium.Material({
                    fabric: {
                      type: "Water",
                      uniforms: {
                        normalMap: "/Assets/Textures/waterNormals.jpg",
                        frequency: 100.0,
                        animationSpeed: 0.01,
                        amplitude: 10.0
                      }
                    }
                  }),
                  //aboveGround : true,
                  fragmentShaderSource:
                    "varying vec3 v_positionMC;\n\
                                                    varying vec3 v_positionEC;\n\
                                                    varying vec2 v_st;\n\
                                                    void main()\n\
                                                    {\n\
                                                        czm_materialInput materialInput;\n\
                                                        vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
                                                        #ifdef FACE_FORWARD\n\
                                                        normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
                                                        #endif\n\
                                                        materialInput.s = v_st.s;\n\
                                                        materialInput.st = v_st;\n\
                                                        materialInput.str = vec3(v_st, 0.0);\n\
                                                        materialInput.normalEC = normalEC;\n\
                                                        materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
                                                        vec3 positionToEyeEC = -v_positionEC;\n\
                                                        materialInput.positionToEyeEC = positionToEyeEC;\n\
                                                        czm_material material = czm_getMaterial(materialInput);\n\
                                                        #ifdef FLAT\n\
                                                        gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
                                                        #else\n\
                                                        gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
                                                        gl_FragColor.a=0.5;\n#endif\n\
                                                    }\n" //重写shader，修改水面的透明度
                }),
                show: true
              });
              Cesium3DViewer.scene.primitives.add(river);
            })
            .catch(error => {
              console.log(error);
            });
        });
      }
    },

    removeShuiti() {
      if (river) {
        Cesium3DViewer.scene.primitives.remove(river);
        river = null;
      }
    },

    removeStage() {
      lastStage && Cesium3DViewer.scene.postProcessStages.remove(lastStage),
        (lastStage = null);
      Cesium3DViewer.scene.skyAtmosphere.hueShift = 0.0;
      Cesium3DViewer.scene.skyAtmosphere.saturationShift = 0.0;
      Cesium3DViewer.scene.skyAtmosphere.brightnessShift = 0.0;
      Cesium3DViewer.scene.fog.enabled = false;
      Cesium3DViewer.scene.fog.density = 2.0e-4;
      Cesium3DViewer.scene.fog.minimumBrightness = 0.1;
    },

    showRain() {
      this.removeStage();
      var e = new Cesium.PostProcessStage({
        name: "czm_rain",
        fragmentShader: this.getRainShader()
      });
      Cesium3DViewer.scene.postProcessStages.add(e), (lastStage = e);
    },

    getRainShader() {
      return "uniform sampler2D colorTexture;\n\
				varying vec2 v_textureCoordinates;\n\
			\n\
				float hash(float x){\n\
					return fract(sin(x*133.3)*13.13);\n\
			}\n\
			\n\
			void main(void){\n\
			\n\
				float time = czm_frameNumber / 60.0;\n\
			vec2 resolution = czm_viewport.zw;\n\
			\n\
			vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
			vec3 c=vec3(.6,.7,.8);\n\
			\n\
			float a=-.4;\n\
			float si=sin(a),co=cos(a);\n\
			uv*=mat2(co,-si,si,co);\n\
			uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
			\n\
			float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
			float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
			c*=v*b; \n\
			\n\
			gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
			}\n\
      ";
    },

    showSnow() {
      this.removeStage();

      var e = new Cesium.PostProcessStage({
        name: "czm_snow",

        fragmentShader: this.getSnowShader()
      });

      Cesium3DViewer.scene.postProcessStages.add(e), (lastStage = e);
      //定义下雪场景 着色器

      Cesium3DViewer.scene.skyAtmosphere.hueShift = -0.8;
      Cesium3DViewer.scene.skyAtmosphere.saturationShift = -0.7;
      Cesium3DViewer.scene.skyAtmosphere.brightnessShift = -0.33;
      Cesium3DViewer.scene.fog.density = 0.001;
      Cesium3DViewer.scene.fog.minimumBrightness = 0.8;
    },

    getSnowShader() {
      return "uniform sampler2D colorTexture;\n\
              varying vec2 v_textureCoordinates;\n\
              \n\
              float snow(vec2 uv,float scale)\n\
              {\n\
              float time = czm_frameNumber / 60.0;\n\
              float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
              uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
              uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
              p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
              k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
              return k*w;\n\
              }\n\
              \n\
              void main(void){\n\
              vec2 resolution = czm_viewport.zw;\n\
              vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
              vec3 finalColor=vec3(0);\n\
              float c = 0.0;\n\
              c+=snow(uv,30.)*.0;\n\
              c+=snow(uv,20.)*.0;\n\
              c+=snow(uv,15.)*.0;\n\
              c+=snow(uv,10.);\n\
              c+=snow(uv,8.);\n\
              c+=snow(uv,6.);\n\
              c+=snow(uv,5.);\n\
              finalColor=(vec3(c)); \n\
              gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
              \n\
              }\n\
              ";
    },

    showFog() {
      this.removeStage();
      //this.FogStage=PostProcessStageLibrary.createBrightnessStage();
      //this.FogStage.uniforms.brightness=2;//整个场景通过后期渲染变亮 1为保持不变 大于1变亮 0-1变暗 uniforms后面为对应glsl里面定义的uniform参数
      var e = new Cesium.PostProcessStage({
        name: "czm_fog",
        fragmentShader: this.getFogShader()
      });
      Cesium3DViewer.scene.postProcessStages.add(e), (lastStage = e);
      //this.FogStage.enabled=true;
    },

    getFogShader() {
      return "uniform sampler2D colorTexture;\n\
              uniform sampler2D depthTexture;\n\
              varying vec2 v_textureCoordinates;\n\
              \n\
              void main(void)\n\
              {\n\
                vec4 origcolor = texture2D(colorTexture, v_textureCoordinates);\n\
                vec4 fogcolor = vec4(0.8,0.8,0.8,0.5);\n\
                float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n\
                vec4 depthcolor = texture2D(depthTexture, v_textureCoordinates);\n\
                //float f = (depthcolor.r-0.22) /0.2;\n\
                float f =depth/5.0;\n\
                if(f < 0.0) f = 0.0;\n\
                else if(f > 1.0) f = 1.0;\n\
                gl_FragColor = mix(origcolor,fogcolor,f);\n\
              }\n\
           ";
    },

    AddCircleRipple() {
      var viewer = Cesium3DViewer;
      var lon = 117.333;
      var lat = 41.333;
      ysc.addCircleRipple(viewer, {
        //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
        id: "111",
        lon: lon,
        lat: lat,
        height: 0,
        maxR: 3000,
        minR: 0, //最好为0
        deviationR: 20, //差值 差值也大 速度越快
        eachInterval: 1000, //两个圈的时间间隔
        imageUrl: require("../plugins/ysc/images/redCircle2.png")
      });

      //如果添加中心线的话：
      viewer.entities.add({
        name: "",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            lon,
            lat,
            0,
            lon,
            lat,
            5000
          ]),
          width: 4,
          material: new Cesium.PolylineGlowMaterialProperty({
            //发光线
            glowPower: 0.1,
            color: Cesium.Color.RED
          })
        }
      });
      viewer.zoomTo(viewer.entities);
    },

    AddODLine() {
      /* 开始 */
      //一：不需要有china.js; option中不需要geo; 每个series数组中元素都加 coordinateSystem: 'GLMap',
      var chinaGeoCoordMap = {
        北京市: [116.29716331849538, 39.94630173165362],
        海淀风廓线: [116.2905556, 39.986944442],
        平谷风廓线: [117.1177778, 40.16944444],
        密云X雷达: [116.8519444, 40.36222222],
        霞云岭风廓线: [115.7402778, 39.72888889],
        上甸子风廓线: [117.1116667, 40.65888889],
        延庆风廓线: [115.9688889, 40.44944444],
        顺义X雷达: [116.6152778, 40.12694444],
        怀柔风廓线: [116.6269444, 40.35777778],
        房山X雷达: [116.1905556, 39.69027778],
        观象台风廓线: [116.4719444, 39.80888889],
        通州X雷达: [116.7525, 39.85444444],
        玉泉路预警塔: [116.2466667, 39.90611111],
        六里桥预警塔: [116.3, 39.88027778],
        马驹桥预警塔: [116.56056996770228, 39.74951162394146],
        三元桥预警塔: [116.4494444, 39.95666667],
        昌平X雷达: [116.3461111, 40.17305556]
      };
      var chinaDatas = [
        [
          {
            name: "海淀风廓线",
            value: 0
          }
        ],
        [
          {
            name: "平谷风廓线",
            value: 0
          }
        ],
        [
          {
            name: "密云X雷达",
            value: 0
          }
        ],
        [
          {
            name: "霞云岭风廓线",
            value: 0
          }
        ],
        [
          {
            name: "上甸子风廓线",
            value: 0
          }
        ],
        [
          {
            name: "延庆风廓线",
            value: 0
          }
        ],
        [
          {
            name: "顺义X雷达",
            value: 0
          }
        ],
        [
          {
            name: "怀柔风廓线",
            value: 0
          }
        ],
        [
          {
            name: "房山X雷达",
            value: 0
          }
        ],
        [
          {
            name: "观象台风廓线",
            value: 0
          }
        ],
        [
          {
            name: "通州X雷达",
            value: 0
          }
        ],
        [
          {
            name: "玉泉路预警塔",
            value: 0
          }
        ],
        [
          {
            name: "六里桥预警塔",
            value: 0
          }
        ],
        [
          {
            name: "马驹桥预警塔",
            value: 0
          }
        ],
        [
          {
            name: "三元桥预警塔",
            value: 0
          }
        ],
        [
          {
            name: "昌平X雷达",
            value: 0
          }
        ]
      ];

      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = chinaGeoCoordMap[dataItem[0].name];
          var toCoord = chinaGeoCoordMap["北京市"];
          if (fromCoord && toCoord) {
            res.push([
              {
                coord: fromCoord,
                value: dataItem[0].value
              },
              {
                coord: toCoord
              }
            ]);
          }
        }
        return res;
      };
      var series = [];
      [["北京市", chinaDatas]].forEach(function(item, i) {
        series.push(
          {
            type: "lines",
            coordinateSystem: "GLMap",
            zlevel: 2,
            effect: {
              show: true,
              period: 4, //箭头指向速度，值越小速度越快
              trailLength: 0.5, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: "arrow", //箭头图标
              symbolSize: 5 //图标大小
            },
            lineStyle: {
              normal: {
                width: 1, //尾迹线条宽度
                opacity: 0.7, //尾迹线条透明度
                color: "#00EAFF", //线的颜色
                curveness: 0.3 //尾迹线条曲直度
              }
            },
            data: convertData(item[1])
          },
          {
            type: "effectScatter",
            coordinateSystem: "GLMap",
            zlevel: 2,
            rippleEffect: {
              //涟漪特效
              period: 4, //动画时间，值越小速度越快
              brushType: "stroke", //波纹绘制方式 stroke, fill
              scale: 4 //波纹圆环最大限制，值越大波纹越大
            },
            label: {
              normal: {
                show: true,
                position: "right", //显示位置
                offset: [5, 0], //偏移设置
                formatter: function(params) {
                  //圆环显示文字
                  return params.data.name;
                },
                fontSize: 13
              },
              emphasis: {
                show: true
              }
            },
            symbol: "circle",
            symbolSize: function(val) {
              return 5 + val[2] * 5; //圆环大小
            },
            itemStyle: {
              normal: {
                show: false,
                color: "#32ff9d" //颜色
              }
            },
            data: item[1].map(function(dataItem) {
              return {
                name: dataItem[0].name,
                value: chinaGeoCoordMap[dataItem[0].name].concat([
                  dataItem[0].value
                ])
              };
            })
          },
          //被攻击点
          {
            type: "scatter",
            coordinateSystem: "GLMap",
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: "stroke",
              scale: 4
            },
            itemStyle: {
              normal: {
                color: "#ff0617" //颜色
              }
            },
            label: {
              normal: {
                show: true,
                position: "right",
                //offset:[5, 0],
                color: "#0f0",
                formatter: "{b}",
                textStyle: {
                  color: "#0f0"
                }
              },
              emphasis: {
                show: true,
                color: "#f60"
              }
            },
            symbol: "pin",
            symbolSize: 20,
            data: [
              {
                name: item[0],
                value: chinaGeoCoordMap[item[0]].concat([10])
              }
            ]
          }
        );
      });

      option = {
        animation: !1,
        GLMap: {},
        series: series
      };

      ysc.echartsCombineCesium(Cesium3DViewer, option);
    },

    Flyto(position) {
      var strs = new Array(); //定义一数组
      strs = position.split(","); //字符分割
      var lon = strs[1];
      var lat = strs[0];
      var alt = strs[2];
      Cesium3DViewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt), // 设置位置
        duration: 2.5,
        //endTransform: Matrix4.IDENTITY
        orientation: {
          heading: Cesium.Math.toRadians(0), // 方向
          pitch: Cesium.Math.toRadians(-90), // 倾斜角度
          roll: Cesium.Math.toRadians(0)
        }
      });
    },

    earthAutoRotateStart() {
      var i = Date.now();
      rotate = function rotate() {
        var a = 0.1;
        var t = Date.now();
        var n = (t - i) / 1e4;
        i = t;
        Cesium3DViewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -a * n);
      };
      Cesium3DViewer.clock.onTick.addEventListener(rotate);
      // setTimeout(function () {
      //     Cesium3DViewer.clock.onTick.removeEventListener(rotate);
      // }, 5000);
    },

    earthAutoRotateStop() {
      Cesium3DViewer.clock.onTick.removeEventListener(rotate);
    },

    AddRectSensor() {
      var position = Cesium.Cartesian3.fromDegrees(117.333, 41.333);
      var entity = Cesium3DViewer.entities.add({
        position: position,
        rectangularSensor: new Cesium.RectangularSensorGraphics({
          //gaze: targetEntity,
          radius: 7500,
          xHalfAngle: Cesium.Math.toRadians(45),
          yHalfAngle: Cesium.Math.toRadians(45),
          lineColor: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
          material: new Cesium.Color(0.0, 1.0, 1.0, 0.4),
          showScanPlane: true,
          scanPlaneColor: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
          scanPlaneMode: "vertical",
          scanPlaneRate: 3
        })
      });
    },

    AddBlueBuilding() {
      if (!buildingTilesetBlue) {
        buildingTilesetBlue = Cesium3DViewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: "http://192.168.2.119:10081/3DTiles/building/tileset.json" //   ./data/3dtiles-lab/tileset.json
          })
        );
        var transparentStyle = new Cesium.Cesium3DTileStyle({
          color: "color('CORNFLOWERBLUE', 0.3)",
          show: true
        });
        buildingTilesetBlue.style = transparentStyle;
      }
    },

    RemoveBlueBuilding() {
      if (buildingTilesetBlue) {
        Cesium3DViewer.scene.primitives.remove(buildingTilesetBlue);
        buildingTilesetBlue = null;
      }
    },

    AddWhiteBuilding() {
      if (!buildingTilesetWhite) {
        buildingTilesetWhite = Cesium3DViewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: "http://192.168.2.119:10081/3DTiles/buildingwhite/tileset.json" //   ./data/3dtiles-lab/tileset.json
          })
        );
        var transparentStyle = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [
              ["${height} >= 20", "color('GHOSTWHITE', 0.5)"],
              ["${height} >= 10", "color('BISQUE', 0.5)"],
              ["${height} >= 5", "color('ALICEBLUE', 0.5)"],
              ["${height} >= 0", "color('LINEN', 0.5)"],
              ["true", "rgb(127, 59, 8)"]
            ]
          },
          show: true
        });
        buildingTilesetWhite.style = transparentStyle;
      }
    },

    RemoveWhiteBuilding() {
      if (buildingTilesetWhite) {
        Cesium3DViewer.scene.primitives.remove(buildingTilesetWhite);
        buildingTilesetWhite = null;
      }
    },

    DrawWindy() {
      let s = new Promise((resolve, reject) => {
        this.$ajax
          .get("/Cesium/SampleData/wind/2017121300.json", null)
          .then(response => {
            var header = response[0].header;
            windy = new Windy(response, Cesium3DViewer);
            this.redrawWindy();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },

    redrawWindy() {
      timer = setInterval(function() {
        windy.animate();
      }, 300);
    }
  },

  state: {
    menus: []
  },
  mutations: {
    ON_SHOWRAIN_CLICK: (state, data) => {
      _this.showRain();
    }
  },
  actions: {
    onShowRainClick({ commit, state }, data) {
      commit("ON_SHOWRAIN_CLICK", data);
    }
  },
  created() {
    this.$bus.on("onWeatherMenuSelect", args => {
      this.showRain();
      let weatherStr = args;
      switch (weatherStr) {
        case "雨":
          this.showRain();
          break;
        case "雪":
          this.showSnow();
          break;
        case "雾":
          this.showFog();
          break;
        case "风":
          this.DrawWindy();
          break;
        default:
          this.removeStage();
          break;
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fullSize {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.cesium-widget-credits {
  display: none !important;
  visibility: hidden !important;
}
</style>

<style>
.cesium-viewer-toolbar {
  top: 10px;
  z-index: 999;
}
.tooltipdiv {
  display: block;
  position: absolute;
  visibility: visible;
  max-width: 200px;
  min-width: 100px;
  padding: 1px 1px 1px 25px;
  font-size: 11px;
  z-index: 1000;
  opacity: 0.8;
  -khtml-opacity: 0.8;
  -moz-opacity: 0.8;
  filter: alpha(opacity=80);
}

.tooltipdiv.left .tooltipdiv-arrow {
  top: 50%;
  right: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 25px solid #000000;
}

.tooltipdiv.right .tooltipdiv-arrow {
  top: 50%;
  left: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 25px solid #000000;
}

.tooltipdiv-inner {
  padding: 3px 8px;
  background-color: #000000;
  color: white;
  text-align: center;
  max-width: 200px;
  text-decoration: none;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.tooltipdiv-arrow {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
