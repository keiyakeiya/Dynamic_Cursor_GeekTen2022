// html要素が入った変数名には最後にElemを付ける, 配列ならElems

// let resistance = 0.1;  //　抵抗のかかり具合 = 速度に比例する抵抗の係数
let resistance = 0.5;  //　抵抗のかかり具合 = 速度に比例する抵抗の係数
// let niseCursorMass  = 5;  // マウスの動きに対する感度 = カーソルの質量
let niseCursorMass  = 10;  // マウスの動きに対する感度 = カーソルの質量

// ニセカーソルの座標
let niseX, niseY;
// ニセカーソルの速度
let niseVX =0;
let niseVY =0;
// カーソルの現在位置
let mouseX, mouseY;
// 1フレーム前のカーソルの位置
let pmouseX, pmouseY;


// カーソル変更
const realCursorElem = document.createElement('div'); //カーソル要素
realCursorElem.id = 'realCursor';
const niseCursorElem = document.createElement('div'); //ニセカーソル要素
niseCursorElem.id = 'niseCursor';

// マウス移動中の処理
document.addEventListener("mousemove",(event) => {
  // カーソル座標の更新
  mouseX = event.clientX;
  mouseY = event.clientY;
},false);

// アニメーションのレンダリング
let render = () => {
  // 力の計算
  // F=force, v=velocity(niseCursor), a=Acceleration(niseCursor), x=coordinate(cursor), t=time(frame), m=mass(niseCursor), resistance=constant
  // F = x(t) - x(t-1) - resistance*v(t-1)
  // v(t) - v(t-1) = a(t) = F/m = (x(t) - x(t-1) - resistance*v(t-1))/m
  niseVX += ((mouseX-pmouseX) -resistance*niseVX)/niseCursorMass;
  niseVY += ((mouseY-pmouseY) -resistance*niseVY)/niseCursorMass;

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
    functions[0](); // これ
  } else if (niseX>window.innerWidth) {
    niseX = window.innerWidth;
    niseVX *= -1;
  }
  if (niseY<0) {
    niseY = 0;
    niseVY *= -1;
  } else if (niseY>window.innerHeight) {
    niseY = window.innerHeight;
    niseVY *= -1;
  }

  // レンダリング
  // カーソル、ニセカーソルを移動
  realCursorElem.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  niseCursorElem.style.transform = `translate(${niseX}px, ${niseY}px)`;

  // マウス座標の更新
  pmouseX = mouseX;
  pmouseY = mouseY;

  // 自分自身を呼び出してループ
  requestAnimationFrame(render);
};

// 初期化処理
window.addEventListener("load",  () => {
  // カーソル、ニセカーソル要素の追加
  document.body.insertAdjacentElement('beforeend', realCursorElem);
  document.body.insertAdjacentElement('beforeend', niseCursorElem);

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


let functions = [];

functions[0] = () => {
  alert('functions 0');
};

functions[1] = () => {
  alert('function1 1');
};

functions[2] = () => {
  alert('function 2');
};
