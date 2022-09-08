// html要素が入った変数名には最後にElemを付ける, 配列ならElems

let resistance = 0.5;  //　抵抗のかかり具合 = 速度に比例する抵抗の係数
let niseCursorMass  = 10;  // カーソルの質量

let sensitivity = 1; // マウスの動きに対する感度

// ニセカーソルの座標
let niseX, niseY;
// ニセカーソルの速度
let niseVX =0;
let niseVY =0;
// カーソルの現在位置
let mouseX, mouseY;
// 1フレーム前のカーソルの位置
let pmouseX, pmouseY;
let dragStartX, dragStartY;
let leftAction = 1;
let rightAction = 2;
let topAction = 3;
let bottomAction = 4;

let isMouseMove = false;
let isMouseDrag = false;
// const minSpeed = 0.1;
const minSpeed = 0.0;
const maxSpeed = 100;

chrome.storage.local.get(
  [
    'resistance',
    'niseMass',
    'lAct',
    'rAct',
    'tAct',
    'bAct'
  ],
  (result) => {
  resistance = (undefined !== result.resistance)? Number(result.resistance):resistance;
  niseCursorMass = (undefined !== result.niseMass)? Number(result.niseMass):niseCursorMass;
  leftAction = (undefined !== result.lAct)? Number(result.lAct):leftAction;
  rightAction = (undefined !== result.rAct)? Number(result.rAct):rightAction;
  topAction = (undefined !== result.tAct)? Number(result.tAct):topAction;
  bottomAction = (undefined !== result.bAct)? Number(result.bAct):bottomAction;
  console.log('resistance: ' + resistance);
  console.log('niseCursorMass: ' + niseCursorMass);

});

// カーソル変更
const realCursorElem = document.createElement('div'); //カーソル要素
realCursorElem.id = 'realCursor';
const niseCursorElem = document.createElement('div'); //ニセカーソル要素
niseCursorElem.id = 'niseCursor';
const niseChildElem = document.createElement('div'); //ニセカーソル中身要素
niseChildElem.id = 'niseChild';
niseCursorElem.appendChild(niseChildElem);

// コントロールエリア
const ctrlAreaElem = document.createElement('div');
ctrlAreaElem.id = 'controlArea'

document.addEventListener("mousedown",(event) => {
  event.preventDefault();
  isMouseDrag = true;
  dragStartX = mouseX;
  dragStartY = mouseY;
},false);

document.addEventListener("mouseup",(event) => {
  isMouseDrag = false;
},false);

// マウス移動中の処理
document.addEventListener("mousemove",(event) => {
// ctrlAreaElem.addEventListener("mousemove",(event) => {
  // カーソル座標の更新
  mouseX = event.clientX;
  mouseY = event.clientY;
  isMouseMove = true;
},false);

// クリックアクション部分
// ctrlAreaElem.addEventListener("click",(event) => {
// realCursorElem.addEventListener("click",(event) => {
// realCursorElem.addEventListener("auxclick",(event) => {
// document.addEventListener("click",(event) => {
realCursorElem.addEventListener("click",(event) => {
  if (dragStartX === mouseX && dragStartY === mouseY) {
    console.log(event.button);
    niseCursorElem.style.display = 'none';
    event.preventDefault();
    const targetElem = document.elementFromPoint(niseX,niseY);
    targetElem.click();
    console.log(targetElem);
    niseCursorElem.style.display = 'block';
  }
},false);
// アニメーションのレンダリング
let render = () => {
  // 力の計算
  // F=force, v=velocity(niseCursor), a=Acceleration(niseCursor), x=coordinate(cursor), t=time(frame), m=mass(niseCursor), resistance=constant
  // F = x(t) - x(t-1) - resistance*v(t-1)
  // v(t) - v(t-1) = a(t) = F/m = (x(t) - x(t-1) - resistance*v(t-1))/m
  // niseVX += ((mouseX-pmouseX) -resistance*niseVX)/niseCursorMass;
  // niseVY += ((mouseY-pmouseY) -resistance*niseVY)/niseCursorMass;

  // if (isMouseMove && isMouseDrag) {
  if (isMouseDrag) {
    // マウス移動中：マウスと連動
    niseVX = sensitivity*(mouseX-pmouseX);
    niseVY = sensitivity*(mouseY-pmouseY);
  } else {
    // マウス停止中：運動方程式を適用
    niseVX += -resistance*niseVX/niseCursorMass;
    niseVY += -resistance*niseVY/niseCursorMass;
  }

  const vMag = Math.sqrt(Math.pow(niseVX,2) + Math.pow(niseVY, 2));
  if (vMag < minSpeed) {
    // 閾値を下回ったら停止
    niseVX = 0;
    niseVY = 0;
  }

  if (vMag > maxSpeed) {
    // 上限を設定
    niseVX = maxSpeed*niseVX/vMag;
    niseVY = maxSpeed*niseVY/vMag;
  }
  // ニセカーソルの更新
  // x=coordinate(niseCursor), v=velocity(niseCursor), t=time
  // x(t) = x(t-dt) + v(t)
  niseX += niseVX;
  niseY += niseVY;

  // 境界との接触をチェック
  // アクション入れるならここ

  if (niseX<0) {
    niseX = 0;
    niseVX *= -1;
    functions(leftAction);
  } else if (niseX>window.innerWidth) {
    niseX = window.innerWidth;
    niseVX *= -1;
    functions(rightAction);
  }
  if (niseY<0) {
    niseY = 0;
    niseVY *= -1;
    functions(topAction);
  } else if (niseY>window.innerHeight) {
    niseY = window.innerHeight;
    niseVY *= -1;
    functions(bottomAction);
  }

  // レンダリング
  // カーソル、ニセカーソルを移動
  realCursorElem.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  niseCursorElem.style.transform = `translate(${niseX}px, ${niseY}px)`;

  const targetElem = document.elementFromPoint(niseX,niseY);
  // if(targetElem.tagName === 'A') {
  //
  // }

  // マウス座標の更新
  pmouseX = mouseX;
  pmouseY = mouseY;

  isMouseMove = false;

  // 自分自身を呼び出してループ
  requestAnimationFrame(render);
};

// 初期化処理
window.addEventListener("load",  () => {
  // カーソル、ニセカーソル要素の追加
  document.body.insertAdjacentElement('beforeend', realCursorElem);
  document.body.insertAdjacentElement('beforeend', niseCursorElem);
  // document.body.insertAdjacentElement('beforeend', ctrlAreaElem);

  // 初期位置を真ん中に設定
  niseX   = window.innerWidth/2;
  niseY   = window.innerHeight/2;
  mouseX  = window.innerWidth/2;
  mouseY  = window.innerHeight/2;
  pmouseX = window.innerWidth/2;
  pmouseY = window.innerHeight/2;

  // レンダリング開始
  render();
},false);


let functions = (actionIn) => {
  switch (actionIn) {
    case 0:
      // no action
      break;
    case 1:
    //   // history.back();
      console.log('function 1');
      break;
    case 2:
    //   // history.forward();
      console.log('function 2');
      break;
    case 3:
      console.log('function 3');
      break;
    case 4:
      console.log('function 4');
      break;
  }
};
