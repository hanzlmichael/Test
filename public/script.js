import { initTag } from './components/tag.js'
import { initQuestionsBar } from './components/questions.js'
import { initMapUploadingFunctionality, activateZooming } from './components/map.js'
import { initPoints } from './components/points.js'
import { initAnswer } from './components/answer.js'
import { initMapIcons } from './components/initIcons.js'
import { startDrawPolygon } from './funcionality/AddPolygon.js';
import { startDrawLine } from './funcionality/addLine.js';
import { startDrawPoint } from './funcionality/addPoint.js';
import { initObjectDeleteIcon } from './globalPrototypeSetting.js';
import { turnOfControls } from "./globalPrototypeSetting.js";
import { resetZoom } from './components/map.js';
import { initProgressBar } from './components/progressBar.js';

let wrap = document.querySelector('.canvas-wrap')
export var canvas = new fabric.Canvas('canvas');
canvas.setDimensions({width: "100%", height:"400px"}, {cssOnly:true})

/* test */
import { getTestById } from './components/questions.js'
document.querySelector('#testbtn').addEventListener('click', testFun)
document.querySelector('#testbtn2').addEventListener('click', testFun2)


var originalSize;

var canvasSize = document.querySelector('.upper-canvas')

function testFun() {
  
  console.log('TESTING: ',canvasSize.clientWidth, canvasSize.clientHeight, canvasSize.offsetWidth, canvasSize.offsetHeight, 
  canvasSize.getBoundingClientRect().width, canvasSize.getBoundingClientRect().height)

  originalSize = [canvasSize.getBoundingClientRect().width, canvasSize.getBoundingClientRect().height]


}
canvas.on('mouse:down', function(e) {
  console.log(canvas.getPointer(e, true));
});


function testFun2() {
  let actualSize = [canvasSize.getBoundingClientRect().width, canvasSize.getBoundingClientRect().height];
  console.log(actualSize[0])
  let scaleRatio = actualSize[0] / originalSize[0]

  canvas.forEachObject(function(obj) {
    if (!(obj instanceof fabric.Image)) {
      obj.scale(scaleRatio);
      obj.left = obj.left * scaleRatio;
      obj.top = obj.top * scaleRatio;
    }
  });  
  canvas.renderAll();
}


if (testBSON(window.location.href || testNewPath())) {
  debugger;
  document.addEventListener('DOMContentLoaded', getTestById)
}

function testNewPath() {
  let url = window.location.href;
  let lastPart = url.split('/').pop();
  if (lastPart == 'new') return true;
  return false;
}
function testBSON(inputString) {
  const lastPart = inputString.split('/').pop();
  if (/^[0-9a-fA-F]{24}$/.test(lastPart)) {
    return true
  }
  return false  
}


initTag();
initQuestionsBar();
initMapUploadingFunctionality();
initPoints();
initAnswer();
initMapIcons();
activateZooming();
initObjectDeleteIcon();
turnOfControls();
activateSettings();
initProgressBar();

function activateSettings() {
  fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.borderColor = "rgb(211,33,45)"
  fabric.Object.prototype.borderDashArray = [5]
}

document.querySelector('.shape-options-wrap').addEventListener('click', startDraw)

function startDraw(e) {
  let typeShape = e.target.dataset.shape
  if (typeShape == 'point') {
    startDrawPoint()
  }
  if (typeShape == 'line') {
    startDrawLine()
  }
  if (typeShape == 'polygon') {
    console.log('polygon')
    startDrawPolygon()
  }
}

document.querySelector('#trash-icon').addEventListener('click', deleteSelectedObjects);

function deleteSelectedObjects() {
  var activeObjects = canvas.getActiveObjects(); // get array of selected objects
  if (activeObjects.length) {
    activeObjects.forEach(function(object) {
      canvas.remove(object); // remove each selected object from the canvas
    });
    canvas.discardActiveObject().renderAll(); // clear selection and redraw canvas
  } else {
    canvas.forEachObject(function(object) {
      if (!(object instanceof fabric.Image)) {
        canvas.remove(object);
      }
    });
  }
}

document.querySelector('#map-upload').addEventListener('change', handleMap);
document.querySelector('.maps-wrap').addEventListener('click', deleteMap);

let mapCount = 0;
const MAX_MAP_COUNT = 5;

let resultImage = document.querySelector(".maps-wrap");

function handleMap(e) {
  
	let input = e.target;
  let len = input.files.length;
  for (let i = 0; i < len; i++) {
    mapCount++;
    if (mapCount > MAX_MAP_COUNT) {
      mapCount--;
      return;
    }
    let reader = new FileReader()
    reader.onload = function() {
      let imageFile = reader.result;
      let name = input.files[i].name;
      if (input.files[i].size > 1000000) {
        alert("Maximální velikost mapy je 1 Mb!");
        mapCount--;
        return;
      }
      console.log(name);
      let html = `<div class="map-wrap">
      <div class="map-image">
        <img src="${imageFile}" alt="">
        <span class="close-map">&#x2716;</span>
      </div> 
      <div class="map-info">
        <div class="placeholder">Název mapy</div>
        <input type="text">
      </div>
    </div>`
      resultImage.insertAdjacentHTML('beforeend', html);
      let setName = document.querySelector('.map-wrap:last-child input');
      setName.value = `${name.split('.')[0]}`;
    }
    reader.readAsDataURL(input.files[i]);    
  }
}

function deleteMap(e) {
  if (e.target.matches('.close-map')) {
    document.querySelector('#map-upload').value = null;
    let clickedMap = e.target.closest('.map-wrap');
    clickedMap.remove();
    mapCount--;
  }
  if (document.querySelector('.maps-wrap').children.length === 0) {
    selectMap.item(0).selected = true;
  }
}

let selectMap = document.querySelector('#select-map')
let mapWrap = document.querySelector('.maps-wrap')
mapWrap.addEventListener('input', handleChangeSelectMapText)
selectMap.addEventListener('change', handleDisplayMap)

function handleChangeSelectMapText() {
  console.log('change')
}

function handleDisplayMap(e) {
  debugger;
  if (selectMap.selectedIndex == 0) {
    canvas.clear()
    return
  }
  let indexCorrection = selectMap.selectedIndex - 1 // Kvůli první disabled options
  let mapElem = mapWrap.children[indexCorrection] // Vyberu správnou mapu k vybranému option
  let mapImage = mapElem.querySelector('img')
  let imageData = mapImage.getAttribute('src')
  resizeMapToCanvas(imageData)
}
let isWidthCalculatedFlag = false;

export function resizeMapToCanvas(data) {
  debugger;
  console.log('resizemapto canvas')
  let width;
  let url = window.location.href;
  const lastString = url.split("/").pop();


  if (!isWidthCalculatedFlag) {
    let page = document.querySelector('.creating-questions-page');
    page.style.display = 'block'
    width = wrap.getBoundingClientRect().width;
    page.style.display = 'none'
    isWidthCalculatedFlag = true;
    if (lastString == 'new') page.style.display = 'block'
  } else {
    width = wrap.getBoundingClientRect().width;
  } 


  canvas.clear()
  fabric.Image.fromURL(data, function(img) {
    img.scaleToWidth(width,true);
    img.selectable = false;
    img.hoverCursor = "default";
    canvas.setDimensions({width:width, height: img.getScaledHeight()})
    canvas.setDimensions({width:"100%",height:"auto"}, {cssOnly:true});
    canvas.add(img);
    canvas.sendToBack(img);
    let height = `${canvas.getHeight()}px`;
    console.log('height', height)
    wrap.style.height =  `${canvas.getHeight()}px`;
    resetZoom();
  })
}

window.onresize = resizeWrap;

function resizeWrap() {
  /* let cc = document.querySelector('#canvas');
  let width = Number(cc.getBoundingClientRect().height) + 16;

  console.log(width);
  wrap.style.height =  `${width}px`; */
}

function onlyOne(checkbox) {
  var checkboxes = document.getElementsByName('check')
  let wrap = checkbox.closest('.answer-wrap')
  console.log(wrap)
  checkboxes.forEach((item) => {
      if (item !== checkbox) {
        item.checked = false
      }
  })
}