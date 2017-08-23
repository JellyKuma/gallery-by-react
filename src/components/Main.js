require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');
// 获取图片数据
var imgDatas = require("json!../data/imgData.json");
// 自执行函数，遍历图片
imgDatas = (function genImgUrl(imgDatasArr) {
  for (var i = 0; i < imgDatasArr.length; i++) {
    var singleImgData = imgDatasArr[i];
    singleImgData.imgUrl = require("../images/" + singleImgData.fileName);
    imgDatasArr[i] = singleImgData;
  }
  return imgDatasArr;
})(imgDatas);
// ImgFigure类，返回图片展示对象
class ImgFigure extends React.Component {
  render() {
    var styleObj = [];
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    return (
      <figure className="imgFig" style={styleObj}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="imgTit">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}
/*
 *获取区间中的一个随机值
 * @param low 区间中的小值
 * @param hight 区间中的大值
 */
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high - low) + low)
}
class AppComponent extends React.Component {
  Constant ={
    centerPos: {//中心点
      left: 0,
      top: 0
    },
    hPosRange: {//水平方向取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {//垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }

  /*
   *重新布局所有图片卡
   * @param centerIndex 指定居中布局哪个图片卡
   */
  action=function(centerIndex) {
    var imgArrangeArr = this.state.imgArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX =hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeX = vPosRange.x,
      vPosRangeTopY = vPosRange.topY,
      imgArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),//取0或1
      topImgSpliceIndex = 0,
      // 取得中间图片的信息
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex,1);
    imgArrangeCenterArr[0].pos = centerPos;
    topImgSpliceIndex = Math.ceil(Math.random()*(imgArrangeArr -topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);
    // 布局位于上侧的图片
    imgArrangeTopArr.forEach(function(value,index){
      imgArrangeTopArr[index].pos = {
        top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
        left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
      }
    });
    // 布局左右两侧的图片
    for(var i = 0,j = imgArrangeArr.length,k = j/2; i < j; i++){
      var hPosRangeLOrR = null;
      //图片数组前半段的内容布局在左边，后半段的布局在右边
      if(i<k){
        hPosRangeLOrR = hPosRangeLeftSecX;
      }else {
        hPosRangeLOrR = hPosRangeRightSecX;
      }
      imgArrangeArr[i].pos = {
        top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLOrR[0],hPosRangeLOrR[1])
      }
    }
    if(imgArrangeTopArr && imgArrangeTopArr[0]){
      imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);
    this.setState({
      imgArrangeArr:imgArrangeArr
    });
  }
  //构造类的基本信息props和state
  constructor(props){
    super(props);
    this.state = {
      imgArrangeArr : []
    }
  }

  componentDidMount() {
    //拿到舞台大小
    var stgDom = ReactDOM.findDOMNode(this.refs.stage),
      stgW = stgDom.scrollWidth,
      stgH = stgDom.scrollHeight,
      halfStgW = Math.ceil(stgW / 2),
      halfStgH = Math.ceil(stgH / 2);
    //拿到一个图片卡的大小
    var imgFigDom = ReactDOM.findDOMNode(this.refs.imgFig0),
      imgW = imgFigDom.scrollWidth,
      imgH = imgFigDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);
    //计算中心图片的位置坐标
    this.Constant.centerPos = {
      left: halfStgW - halfImgW,
      top: halfStgH - halfImgH
    }
    // 计算左右两侧区域的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStgW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStgW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stgW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stgH - halfImgH;
    // 计算上侧区域的取值范围
    this.Constant.vPosRange.x[0] = halfStgW - imgW;
    this.Constant.vPosRange.x[1] = stgW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStgH - halfImgH * 3;

    this.action(0);
    console.log("a");
  }

  render() {
    var crtUnits = [];
    var imgFigures = [];
    imgDatas.forEach(function (val, index) {
      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          }
        }
      }
      imgFigures.push(<ImgFigure data={val} ref={"imgFig" + index} arrange={this.state.imgArrangeArr[index]}/>)
    }.bind(this));
    return (
      // *<div className="index">*/
      //   /*<img src={yeomanImage} alt="Yeoman Generator" />*/
      //   /*<div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>*/
      // /*</div>*


      <div className="stage" ref="stage">
        <section className="imgSec">
          {imgFigures}
        </section>
        <nav className="imgCtr">
          {crtUnits}
        </nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
