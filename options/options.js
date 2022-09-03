let propInputElems = document.querySelectorAll('.propInput input');
let propDispElems = document.querySelectorAll('.propInput .propValue');

for(let i=0; i<propInputElems.length; i++) {
  propInputElems[i].addEventListener("input", (event) => {
    propDispElems[i].innerHTML = propInputElems[i].value;
  },false);
}
