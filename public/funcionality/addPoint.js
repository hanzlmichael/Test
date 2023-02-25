import { canvas } from "../script.js"

export function startDrawPoint() {
	canvas.on('mouse:down', drawCircle)
	canvas.on('mouse:move', drawTempCircle)
}
function getCoords(e) {
	let coords = canvas.getPointer(e)
  return {x:coords.x, y:coords.y}
}
function drawCircle(e) {
  createCircle(e, false)
  stopDraw()
}

function drawTempCircle(e) {
	// smazat stary
  let objs = canvas.getObjects('circle')
  objs.filter(obj => {
  	if (obj.isTemp == true) {
    	canvas.remove(obj)
    } 
  })  
  // vykreslit novy
  createCircle(e, true)
}

function createCircle(e, isTemp) {
	let coords = getCoords(e)
  let circle = new fabric.Circle({
  	fill: "rgba(245,36,47,0.9)",
    radius: 7,
    left: coords.x - 7,
    top: coords.y - 7,
    isTemp: isTemp
  })
  canvas.add(circle)
}

function stopDraw() {
	canvas.off('mouse:move')
  canvas.off('mouse:down')
  let allObjs = canvas.getObjects('circle')
 allObjs.filter(obj => {
  	if (obj.isTemp == true) {
    	canvas.remove(obj)
    } 
  })
  canvas.setActiveObject(allObjs[allObjs.length - 1]);
}

