let resistance = 0.1;
let niseCursorMass  = 10;
let leftAction = 1;
let rightAction = 2;
let topAction = 3;
let bottomAction = 4;

//カーソルの動作モード初期値は慣性
let modeSelect =0;

let propInputElems = document.querySelectorAll('.propInput input');
let propDispElems = document.querySelectorAll('.propInput .propValue');
let actionInputElems = {};
actionInputElems.top = document.querySelector('#topAction_select');
actionInputElems.bottom = document.querySelector('#bottomAction_select');
actionInputElems.left = document.querySelector('#leftAction_select');
actionInputElems.right = document.querySelector('#rightAction_select');

let cursorModeElems = document.querySelector('#mode_select');

const actionNameList = [
  'なし',
  '前のページへ進む',
  '次のページへ進む',
  '新しいタブを開く',
  'action4'
];
//カーソルの動作モードの種類
const cursorModeList = [
  '慣性モード',
  'ばねモード',
  '万有引力モード',
  '重力モード',
  'なし'
];

for(let i=0; i<actionNameList.length; i++) {
  const optionElem = document.createElement('option');
  optionElem.innerHTML = actionNameList[i];
  optionElem.value = i;
  actionInputElems.top.insertAdjacentElement('beforeend',optionElem.cloneNode(true));
  actionInputElems.bottom.insertAdjacentElement('beforeend',optionElem.cloneNode(true));
  actionInputElems.left.insertAdjacentElement('beforeend',optionElem.cloneNode(true));
  actionInputElems.right.insertAdjacentElement('beforeend',optionElem.cloneNode(true));
}

for(let i=0; i<cursorModeList.length; i++) {
  const modeElem = document.createElement('option');
  modeElem.innerHTML = cursorModeList[i];
  modeElem.value = i;
  cursorModeElems.insertAdjacentElement('beforeend',modeElem.cloneNode(true));
}

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

  propDispElems[0].innerHTML = resistance;
  propInputElems[0].value = resistance;
  propDispElems[1].innerHTML = niseCursorMass;
  propInputElems[1].value = niseCursorMass;

  actionInputElems.top.value = topAction;
  actionInputElems.bottom.value = bottomAction;
  actionInputElems.left.value = leftAction;
  actionInputElems.right.value = rightAction;

  cursorModeElems.value = modeSelect;
});

for(let i=0; i<propInputElems.length; i++) {
  propInputElems[i].addEventListener("input", (event) => {
    propDispElems[i].innerHTML = propInputElems[i].value;
  },false);
}

propInputElems[0].addEventListener("change", (event) => {
  chrome.storage.local.set({resistance: propInputElems[0].value}, () => {});
},false);

propInputElems[1].addEventListener("change", (event) => {
  chrome.storage.local.set({niseMass: propInputElems[1].value}, () => {});
},false);

actionInputElems.top.addEventListener("change", (event) => {
  chrome.storage.local.set({tAct: actionInputElems.top.value}, () => {});
},false);

actionInputElems.bottom.addEventListener("change", (event) => {
  chrome.storage.local.set({bAct: actionInputElems.bottom.value}, () => {});
},false);

actionInputElems.left.addEventListener("change", (event) => {
  chrome.storage.local.set({lAct: actionInputElems.left.value}, () => {});
},false);

actionInputElems.right.addEventListener("change", (event) => {
  chrome.storage.local.set({rAct: actionInputElems.right.value}, () => {});
},false);

cursorModeElems.addEventListener("change", (event) => {
  chrome.storage.local.set({mode: cursorModeElems.value}, () => {});
},false);

//document.getElementById("reload").addEventListener('click',(event) => {
  //window.location.reload();
  //console.log('button');
//},false);

