// html要素が入った変数名には最後にElemを付ける, 配列ならElems

let resistance = 0.1;  //　抵抗のかかり具合 = 速度に比例する抵抗の係数
// let resistance = 0.5;  //　抵抗のかかり具合 = 速度に比例する抵抗の係数
// let niseCursorMass  = 5;  // マウスの動きに対する感度 = カーソルの質量
let niseCursorMass  = 10;  // マウスの動きに対する感度 = カーソルの質量

let sensitivity = 2;

// ニセカーソルの座標
let niseX, niseY;
// ニセカーソルの速度
let niseVX =0;
let niseVY =0;
// カーソルの現在位置
let mouseX, mouseY;
// 1フレーム前のカーソルの位置
let pmouseX, pmouseY;
let leftAction = 0;
let rightAction = 1;
let topAction = 2;
let bottomAction = 3;

let isMouseMove = false;
const minSpeed = 0.1;
const maxSpeed = 10;

// カーソル変更
const realCursorElem = document.createElement('div'); //カーソル要素
realCursorElem.id = 'realCursor';
const niseCursorElem = document.createElement('div'); //ニセカーソル要素
niseCursorElem.id = 'niseCursor';

// コントロールエリア
const ctrlAreaElem = document.createElement('div');
ctrlAreaElem.id = 'controlArea'

// マウス移動中の処理
// document.addEventListener("mousemove",(event) => {
ctrlAreaElem.addEventListener("mousemove",(event) => {
  // カーソル座標の更新
  mouseX = event.clientX;
  mouseY = event.clientY;
  isMouseMove = true;
},false);

// クリックアクション部分
ctrlAreaElem.addEventListener("click",(event) => {
// realCursorElem.addEventListener("click",(event) => {
// realCursorElem.addEventListener("auxclick",(event) => {
  console.log(event.button);
  niseCursorElem.style.display = 'none';
  event.preventDefault();
  const targetElem = document.elementFromPoint(niseX,niseY);
  targetElem.click();
  console.log(targetElem);
  niseCursorElem.style.display = 'block';
},false);
// アニメーションのレンダリング
let render = () => {
  // 力の計算
  // F=force, v=velocity(niseCursor), a=Acceleration(niseCursor), x=coordinate(cursor), t=time(frame), m=mass(niseCursor), resistance=constant
  // F = x(t) - x(t-1) - resistance*v(t-1)
  // v(t) - v(t-1) = a(t) = F/m = (x(t) - x(t-1) - resistance*v(t-1))/m
  niseVX += ((mouseX-pmouseX) -resistance*niseVX)/niseCursorMass;
  niseVY += ((mouseY-pmouseY) -resistance*niseVY)/niseCursorMass;

  // if (isMouseMove) {
  //   // マウス移動中：マウスと連動
  //   niseVX = sensitivity*(mouseX-pmouseX);
  //   niseVY = sensitivity*(mouseY-pmouseY);
  // } else {
  //   // マウス停止中：運動方程式を適用
  //   niseVX += -resistance*niseVX/niseCursorMass;
  //   niseVY += -resistance*niseVY/niseCursorMass;
  // }

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
    functions[leftAction]();
  } else if (niseX>window.innerWidth) {
    niseX = window.innerWidth;
    niseVX *= -1;
    functions[rightAction]();
  }
  if (niseY<0) {
    niseY = 0;
    niseVY *= -1;
    functions[topAction]();
  } else if (niseY>window.innerHeight) {
    niseY = window.innerHeight;
    niseVY *= -1;
    functions[bottomAction]();
  }

  // レンダリング
  // カーソル、ニセカーソルを移動
  // realCursorElem.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  niseCursorElem.style.transform = `translate(${niseX}px, ${niseY}px)`;

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
  // document.body.insertAdjacentElement('beforeend', realCursorElem);
  document.body.insertAdjacentElement('beforeend', niseCursorElem);
  document.body.insertAdjacentElement('beforeend', ctrlAreaElem);

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

window.addEventListener("mouseenter", () => {
  console.log('mouse enter');
},false);

let functions = [];

functions[0] = () => {
  // history.back();
  console.log('function 0');
};

functions[1] = () => {
  // history.forward();
  console.log('function 1');
};

functions[2] = () => {
  console.log('function 2');
};

functions[3] = () => {
  console.log('function 3');
};
