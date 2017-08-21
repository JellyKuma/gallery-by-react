require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
// 获取图片数据
var imgDatas = require("../data/imgData.json");
// 自执行函数，遍历图片
imgDatas = (function genImgUrl(imgDatasArr){
  for(var i =0;i<imgDatasArr.length;i++){
    var singleImgData = imgDatasArr[i];
    singleImgData.imgUrl = require("../images/"+singleImgData.fileName);
    imgDatasArr[i] = singleImgData;
  }
  return imgDatasArr;
})(imgDatas)

class AppComponent extends React.Component {
  render() {
    return (
      // *<div className="index">*/
      //   /*<img src={yeomanImage} alt="Yeoman Generator" />*/
      //   /*<div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>*/
      // /*</div>*
      <div className="stage">
        <section className="imgSec"></section>
        <nav className="imgCtr"></nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
