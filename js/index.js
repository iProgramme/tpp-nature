/**
 * Created by yubowen on 2017/7/3.
 */
var canvas = document.querySelector("#canvas")
var ctx = canvas.getContext("2d")
var img = new Image()
img.src = "./images/space1.png";
// 座位
var arr = [10,10,10,10,10,8,4,10,15]
// 双击放大缩小
var flagD = false
// 缩小比例
var scale = 1,sp = 1


// 最佳观影区
img.onload = function(){
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i]; j++) {
      ctx.drawImage(img,0,0,110,106,j*55,i*55,50,50);
    }
  }
}

// 数组记录座位是否被点击过
var seat = []
// canvas添加单击事件


function selectSeat(e) {
  // console.log(e.offsetX);
  // var p=32*55/100;
  flagD?p = 320/1000*55:p=55
  // 当放大之后,要拿到 translate 的值
  var arrnei = (canvas.style.transform+"").slice(10).split("px");
  if (arrnei[1]) {
    arrnei[1]=arrnei[1].slice(2)
  }else{
    arrnei[0]=0;
    arrnei[1]=0;
  }

  // console.log(arrnei)
  var x = Math.floor((-arrnei[0]+e.pageX) / p)
  var y = Math.floor((-arrnei[1]+e.pageY-150) / p)
// console.log(seat)
  // 首先判断原来这个地方是否有座位可点
  for (var k = 0; k < arr.length; k++) {
    if (x<arr[k]&&y==k) {
      break
    }
  }
  if (k == arr.length) {
    return
  }

  // 判断若已选,则返回
  for (var i = 0; i < seat.length; i++) {
    if (x==seat[i][0]&&y == seat[i][1]) {
      ctx.drawImage(img,0,0,110,106,x*55,y*55,50,50);
      seat.splice(i,1)
      // console.log(1)
      return
    }
  }
  // 判断若已选5个,则不能继续选取
  if(seat.length>=5){
    return
  }

  // 将座位改为选取
  seat.push([x,y])
  ctx.drawImage(img,110,106,110,106,x*55,y*55,50,50)
  ctx.fillStyle = "#ffffff";
  ctx.fillText(x+1+"排",x*55+15,y*55+18)
  ctx.fillText(y+1+"座",x*55+15,y*55+33)

}

// 记录x,y的初始值,位移值和结束的值
var px=0,py=0,movex=0,movey=0,endx=0,endy=0;
var px2 = 0,py2 = 0;
// 记录时间判断是否为双击
var time = {
  t1:0,
  t2:0
}
// 记录当前的 transform 的值
var arrmove = [];
// 记录当前的缩放比例
var scaleD = 1;
var sc = 1
var flag = false
canvas.addEventListener("touchstart",function (e) {
  arrmove = (canvas.style.transform+"").slice(10).split("px");
  if (arrmove[1]) {
    arrmove[1]=arrmove[1].slice(2)
  }else{
    arrmove[0]=0;
    arrmove[1]=0;
  }
  px = e.touches[0].clientX
  py = e.touches[0].clientY
  if (e.touches[1]) {
    px2 = e.touches[1].clientX
    py2 = e.touches[1].clientY
    // 两手指连线的长度
    scaleD =Math.pow( Math.pow(px2-px,2)+Math.pow(py2-py,2),0.5)
  }
  removeTransition()
})
canvas.addEventListener("touchmove",function (e) {

  var x = e.touches[0].clientX
  var y = e.touches[0].clientY
  movex = x-px
  movey = y-py
  if (e.touches[1]) {
    var x2 = e.touches[1].clientY;
    var y2 = e.touches[1].clientY;
    // 开始做放大缩小
    sc = Math.pow( Math.pow(x2-x,2)+Math.pow(y2-y,2),.5)
    sc = sc/scaleD
    canvas.style.transform = "translate("+(+arrmove[0]+movex+endx-(x2-x)/2)+"px,"+(+arrmove[1]+movey+endy-(y2-y)/2)+"px) scale("+sc+")"
    flag = true
    return
  }


  canvas.style.transform = "translate("+(+arrmove[0]+movex+endx)+"px,"+(+arrmove[1]+movey+endy)+"px) scale(1)"
})
canvas.addEventListener("touchend",function (e) {
  time.t1 = +new Date()
  time.t1 = time.t2
  time.t2 = +new Date()
  canvas.style.transformOrigin = "left top"

  var lx = -e.changedTouches[0].clientX/32*100+160
  var ly = -(e.changedTouches[0].clientY-200)/32*100

  var qx = (+arrmove[0]+movex+endx)
  var qy = (+arrmove[1]+movey+endy)
  // endx = movex+endx
  // endy = movey+endy
  if (flag) {
    flag = false
    return
  }
  // 若 true 说明是双击事件
  if (time.t2-time.t1<300) {
    // console.log("双击")
    transitionAll()
    flagD = !flagD

    if (flagD) {
      canvas.style.transform = "scale(0.32) "
    }else{
      // 判断临界值
      if (lx>=0) {
        lx=0
      }
      if (lx<=-680) {
        lx=-680
      }
      if (ly>=0) {
        ly = 0
      }
      if (ly<=-200) {
        ly = -200
      }
      console.log(lx)
      canvas.style.transformOrigin = "0px 0px"
      canvas.style.transform = "translate("+lx+"px,"+ly+"px) scale(1)"
    }
    setTimeout(removeTransition,400)
  }else{
    if (qx>=0) {
      qx=0
    }
    if (qx<=-680) {
      qx=-680
    }
    if (qy>=0) {
      qy = 0
    }
    if (qy<=-200) {
      qy = -200
    }
    canvas.style.transformOrigin = qx+"px "+qy+"px"
    if (flagD) {
      canvas.style.transform = "translate("+qx+"px,"+qy+"px) scale(0.32)"
    }else{
      canvas.style.transform = "translate("+qx+"px,"+qy+"px) scale(1)"
    }
    selectSeat(e.changedTouches[0])
  }
  movex = 0
  movey = 0
  endx=0
  endy=0
  px = 0
  py = 0
  px2 = 0
  py2 = 0

})


// 过渡
function transitionAll() {
  canvas.style.transition = "all .3s"
}
function removeTransition() {
  canvas.style.transition = "none"
}






