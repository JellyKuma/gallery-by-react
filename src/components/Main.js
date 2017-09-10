require('normalize.css/normalize.css');
//require('styles/App.css');
require('styles/fonts/iconfont.css');
require('styles/app.less');
import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片数据
var imgDatas = require('json!../data/imgData.json');
// 自执行函数，遍历图片
imgDatas = (function genImgUrl(imgDatasArr) {
  for (var i = 0; i < imgDatasArr.length; i++) {
    var singleImgData = imgDatasArr[i];
    singleImgData.imgUrl = require('../images/' + singleImgData.fileName);
    imgDatasArr[i] = singleImgData;
  }
  return imgDatasArr;
})(imgDatas);
// ImgFigure类，返回图片展示对象
class ImgFigure extends React.Component {
  handleClick = function (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }.bind(this)

  render() {
    var styleObj = [];
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    // 如果图片的旋转角度不为0，添加角度
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (i) {
        styleObj[i] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }
    if(this.props.arrange.isCenter === true){
      styleObj.zIndex = 11;
      styleObj.boxShadow = '0 0 30px rgba(0, 0, 0, 0.2)';
    }
    // 定义图片卡css类名
    var imgFigCssName = 'imgFig';
    imgFigCssName += this.props.arrange.isInverse ? ' isInverse' : '';

    return (
      <figure className={imgFigCssName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className='imgTit'>{this.props.data.title}</h2>
          <div className='imgBack' onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
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
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low)
}
/*
 *获取0-30°之间的一个任意正负值
 */
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '+' : '-') + Math.ceil(Math.random() * 30));
}

// 控制器类
class ControllerUnit extends React.Component {
  handleClick = function(e){
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }.bind(this);
  render(){
    var controllerUnitClassName = 'controllerUnit';
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' isCenter iconfont icon-image';
      if(this.props.arrange.isInverse){
        controllerUnitClassName += ' isInverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

// 主场景类
class AppComponent extends React.Component {
  Constant = {
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
   *翻转图片
   * @param index输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {function}这是一个闭包函数，返回一个被存贮在内存中的局部变量
   */
  inverse = function (index) {
    return function () {
      var imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      this.setState(
        {imgArrangeArr: imgArrangeArr}
      )
    }.bind(this)
  }
  /*
   *重新布局所有图片卡
   * @param centerIndex 指定居中布局哪个图片卡
   */
  action = function (centerIndex) {
    var imgArrangeArr = this.state.imgArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeX = vPosRange.x,
      vPosRangeTopY = vPosRange.topY,
      imgArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),//取0或1
      topImgSpliceIndex = 0,
      // 取得中间图片的信息
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
    //设置中间图片的位置信息，不需要旋转
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
    // 布局位于上侧的图片
    imgArrangeTopArr.forEach(function (value, index) {
      imgArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });
    // 布局左右两侧的图片
    for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLOrR = null;
      //图片数组前半段的内容布局在左边，后半段的布局在右边
      if (i < k) {
        hPosRangeLOrR = hPosRangeLeftSecX;
      } else {
        hPosRangeLOrR = hPosRangeRightSecX;
      }
      imgArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLOrR[0], hPosRangeLOrR[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }
    // 把之前拉出来的top和center图片放回到数组中并重新设置state状态
    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);
    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }

  /*
   *利用action函数，居中对应index 的图片
   * @param index，需要被居中的图片对应的图片信息数组的index值
   * @return {Function}
   */
  center = function (index) {
    return function () {
      this.action(index);
    }.bind(this);
  }
  //构造类的基本信息props和state
  constructor(props) {
    super(props);
    this.state = {
      imgArrangeArr: [
        // {
        //   pos:{
        //     left:"0",
        //     top:"0"
        //   },
        //   rotate:0,
        // isInverse : false //是否翻转图片(默认不翻转)
        // isCenter:false //图片是否居中（默认不居中）
        // }
      ]
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
      top: halfStgH - halfImgH - 40
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
  }

  render() {
    var crtUnits = [];
    var imgFigures = [];
    imgDatas.forEach(function (val, index) {
      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={val} key={index} ref={'imgFig' + index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
      crtUnits.push(<ControllerUnit key={index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));
    return (
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
