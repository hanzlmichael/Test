import { canvas } from "../script.js";
import { turnOfControls } from "../globalPrototypeSetting.js";

let c = console.log.bind(console)

let points = [];
let clicks = 0;
let tempColor = "rgba(245,36,47,0.45)"
let permColor = "rgba(245,36,47,0.9)"

function startDraw(o) {
  canvas.off("mouse:move", firstDraw);
  clicks++;

  if (validate(o)) {    
    canvas.off("mouse:move");
    canvas.off("mouse:down");
    clicks--;
    points[clicks] = points[0]
    points.pop()
    drawFinalPolygon() 
    resetValues()    
    return;
  }
  canvas.on("mouse:move", drawFinal)
}

function drawFinal(o) {  
  drawPolygon("temporary", tempColor, o);
  if (validate(o)) {
    points[clicks + 1] = points[0];
    drawPolygon("temporary", permColor, o);
  }
}
function finishShape() {
  canvas.off("mouse:move");
  canvas.off("mouse:down");
 /*  removeTempObjects() 
  removeStartCircle() */
  drawFinalPolygon()
  resetValues()
}
export function startDrawPolygon() {
  canvas.on('mouse:dblclick', finishShape)
  turnOfControls()
  activateSettings() 
  canvas.off('mouse:move')
  canvas.off('mouse:down')

  removeTempObjects() 
  removeStartCircle()
  resetValues()

  canvas.on("mouse:move", firstDraw)
  canvas.on("mouse:down", startDraw)
}

function firstDraw(o) {
  points[clicks] = getCoords(o)
  drawCircle(canvas.getPointer("mouse:move", false), "circle", true);
}

function resetValues() {
  points.length = 0
  clicks = 0
}

function stop() {
  canvas.off('mouse:move')
  canvas.off('mouse:click')
  canvas.clear()
}

function drawCircle(coords, type, startPoint) {
  removeStartCircle()
  let startCircle = new fabric.Circle({
    radius: "3",
    fill: permColor,
    top: coords.y - 3,
    left: coords.x - 3,
    shapeType: type,
    startPoint: startPoint,
  });
  canvas.add(startCircle);
}

function drawPolygon(type, color,o) {
  let poly = new fabric.Polyline(points, {
    fill: color,
    stroke: permColor,
    shapeType: type,
  });

  points[clicks] = getCoords(o);
  removeTempObjects();
  canvas.add(poly);
}

function drawFinalPolygon() {  
  removeTempObjects();
  removeStartCircle()
  let deepCopy = structuredClone(points)
  let poly = new fabric.Polyline(deepCopy, {
    fill: permColor,
    stroke: permColor,
    shapeType: "permament"
  });
  canvas.add(poly)
  canvas.renderAll()
}

function removeTempObjects() {
  let objs = canvas.getObjects();
  objs.forEach((el) => {
    if (el.shapeType == "temporary") {
      canvas.remove(el);
    }
  });
}

function removeStartCircle() {
  let objs = canvas.getObjects();
  objs.forEach((el) => {
    if (el.shapeType == "circle") {
      canvas.remove(el);
    }
  });
}

function getCoords(o) {
 // return canvas.getPointer(options.e, false);
/*  console.log(canvas.getPointer("mouse:move", false)) */
  if (o.e.type == "mousemove") return canvas.getPointer("mouse:move", false)
	if (o.e.type == "mousedown") return canvas.getPointer("mouse:down", false)
}

function isPointInCircle(point) {
  return (
    Math.sqrt(
      Math.pow(point.x - points[0].x, 2) + Math.pow(point.y - points[0].y, 2)
    ) <= 4
  );
}

function validate(o) {
	if (o.e.type == "mousemove") return isPointInCircle(canvas.getPointer("mouse:move", false)) && clicks > 2;
	if (o.e.type == "mousedown") return isPointInCircle(canvas.getPointer("mouse:down", false)) && clicks > 2;
}

function activateSettings() {
  fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.borderColor = "rgb(211,33,45)"
  fabric.Object.prototype.borderDashArray = [5]
}