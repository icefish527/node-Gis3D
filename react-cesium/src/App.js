import './App.css';

import React, { Component } from 'react';
import * as Cesium from "cesium/Cesium";

class App extends Component {
  componentDidMount() {
    //Cesium.Ion.defaultAccessToken = 'your_access_token';
    const viewer = new Cesium.Viewer("cesiumContainer");
  }
  render() {
    return (
      <div id="cesiumContainer" />
    );
  }
}

export default App;
