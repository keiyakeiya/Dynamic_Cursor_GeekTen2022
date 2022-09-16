// html要素が入った変数名には最後にElemを付ける, 配列ならElems

let resistance = 0.1;  //　抵抗のかかり具合 = 速度に比例する抵抗の係数
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
let leftAction = 1;
let rightAction = 2;
let topAction = 3;
let bottomAction = 4;

let modeSelect =0;

let isMouseMove = false;
const minSpeed = 0.1;
const maxSpeed = 20;
let niseflg = true;

let delayTime = 50;
let moveTimer = 0;

chrome.storage.local.get(
  [
    'resistance',
    'niseMass',
    'lAct',
    'rAct',
    'tAct',
    'bAct',
    'mode'
  ],
  (result) => {
  resistance = (undefined !== result.resistance)? Number(result.resistance):resistance;
  niseCursorMass = (undefined !== result.niseMass)? Number(result.niseMass):niseCursorMass;
  leftAction = (undefined !== result.lAct)? Number(result.lAct):leftAction;
  rightAction = (undefined !== result.rAct)? Number(result.rAct):rightAction;
  topAction = (undefined !== result.tAct)? Number(result.tAct):topAction;
  bottomAction = (undefined !== result.bAct)? Number(result.bAct):bottomAction;
  modeSelect = (undefined !== result.mode)? Number(result.mode):modeSelect;
  console.log('resistance: ' + resistance);
  console.log('niseCursorMass: ' + niseCursorMass);
  console.log(modeSelect);
});
//ニセカーソルON OFFのフラグ
document.body.addEventListener('keyup',
    event => {
        if (event.key === 'q') {
           if(niseflg === false)niseflg = true;
           else niseflg = false;
           console.log(niseflg);
        }
    });

// カーソル変更
const realCursorElem = document.createElement('div'); //カーソル要素
realCursorElem.id = 'realCursor';
const niseCursorElem = document.createElement('div'); //ニセカーソル要素
niseCursorElem.id = 'niseCursor';

// コントロールエリア
//const ctrlAreaElem = document.createElement('div');
//ctrlAreaElem.id = 'controlArea'

// マウス移動中の処理
document.addEventListener("mousemove",(event) => {
//ctrlAreaElem.addEventListener("mousemove",(event) => {
  // カーソル座標の更新
  clearTimeout(moveTimer);
  mouseX = event.clientX;
  mouseY = event.clientY;
  isMouseMove = true;
  moveTimer = setTimeout(function(){
    isMouseMove = false;
  },delayTime);

},false);
document.addEventListener("mouseout",(event) => {
  clearTimeout(moveTimer);
},false);

// クリックアクション部分
//ctrlAreaElem.addEventListener("click",(event) => {
realCursorElem.addEventListener("click",(event) => {
// realCursorElem.addEventListener("auxclick",(event) => {
  if(niseflg==true){
  console.log(event.button);
  niseCursorElem.style.display = 'none';
  event.preventDefault();
  const targetElem = document.elementFromPoint(niseX,niseY);
  targetElem.click();
  console.log(targetElem);
  niseCursorElem.style.display = 'block';
  }
  console.log(isMouseMove);
},false);


// アニメーションのレンダリング
let render = () => {
  // 力の計算
  // F=force, v=velocity(niseCursor), a=Acceleration(niseCursor), x=coordinate(cursor), t=time(frame), m=mass(niseCursor), resistance=constant
  // F = x(t) - x(t-1) - resistance*v(t-1)
  // v(t) - v(t-1) = a(t) = F/m = (x(t) - x(t-1) - resistance*v(t-1))/m
  
  if(niseflg == true){
    if(modeSelect == 0){
      niseVX += ((mouseX-pmouseX) -resistance*niseVX)/niseCursorMass;
      niseVY += ((mouseY-pmouseY) -resistance*niseVY)/niseCursorMass;
    }
    else if(modeSelect == 1){
      let l = 300; 
    //ニセカーソルとカーソルの距離
    let r = Math.sqrt(Math.pow(Math.abs(mouseX - niseX),2)+Math.pow(Math.abs(mouseY+niseY),2));
    // v(t) - v(t-1) = a(t) = F/m = -k(x-l)/m
    niseVX += resistance*(Math.abs(mouseX-niseX)-l)/niseCursorMass;
    niseVY += resistance*(Math.abs(mouseY-niseY)-l)/niseCursorMass;
    }
    else if(modeSelect == 2){
      let gmM = 1000; // G*m*Mをひとまとめに
      let distdist = Math.max(Math.pow(mouseX-niseX, 2)+Math.pow(mouseY-niseY, 2), 0.000001); //距離の２乗, 0割りしないように&重力が大きくなりすぎないように
      niseVX += ((gmM*(mouseX-niseX)/Math.pow(distdist,3/2)) -resistance*niseVX)/niseCursorMass;
      niseVY += ((gmM*(mouseY-niseY)/Math.pow(distdist,3/2)) -resistance*niseVY)/niseCursorMass;
    }
    else if(modeSelect == 3){
      if(isMouseMove){
        niseX = mouseX;
        niseY = mouseY;
      }else{
        let friction = 0.8;
        niseVY += resistance;
        if(niseY > window.innerHeight){
          niseVY *= -1*friction;
          if(Math.abs(niseVY) < resistance){
            niseVY= 0;
          }
        }
      }
    }
    else if(modeSelect == 4){
      niseCursorElem.style.display = 'none';
      realCursorElem.style.display = 'none';
    }
  }else{
    niseVX = 0;
    niseVY = 0;
  }
  
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
    niseVX *= -0.3;
    functions(leftAction);
  } else if (niseX>window.innerWidth) {
    niseX = window.innerWidth;
    niseVX *= -0.3;
    functions(rightAction);
  }
  if (niseY<0) {
    niseY = 0;
    niseVY *= -0.3;
    functions(topAction);
  } else if (niseY>window.innerHeight) {
    if(modeSelect != 3){
    niseY = window.innerHeight;
    niseVY *= -0.3;
    }
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

  //isMouseMove = false;

  // 自分自身を呼び出してループ
  requestAnimationFrame(render);
};

// 初期化処理
window.addEventListener("load",  () => {
  // カーソル、ニセカーソル要素の追加
  document.body.insertAdjacentElement('beforeend', realCursorElem);
  document.body.insertAdjacentElement('beforeend', niseCursorElem);
  //document.body.insertAdjacentElement('beforeend', ctrlAreaElem);

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
      history.back();
      break;
    case 2:
      history.forward();
      break;
    case 3://新しいタブを開く
      let options = "menubar=yes";
      window.open('https://www.google.co.jp/',options);
      break;
    case 4://ページ最上部へ
      window.scroll({top: 0, behavior: 'smooth'});
      break;
    case 5://ページ最下部へ
      var element = document.documentElement;
      var bottom = element.scrollHeight - element.clientHeight;
      window.scrollTo({top: bottom, left: 0, behavior: 'smooth'});
      break;
    case 6:
      break;
  }
};

