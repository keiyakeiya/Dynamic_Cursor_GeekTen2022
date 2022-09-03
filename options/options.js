let resistance = 0.1;
let niseCursorMass  = 10;
let leftAction = 0;
let rightAction = 1;
let topAction = 2;
let bottomAction = 3;

let propInputElems = document.querySelectorAll('.propInput input');
let propDispElems = document.querySelectorAll('.propInput .propValue');

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

  propDispElems[0].innerHTML = resistance;
  propInputElems[0].value = resistance;
  propDispElems[1].innerHTML = niseCursorMass;
  propInputElems[1].value = niseCursorMass;

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
