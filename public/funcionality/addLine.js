import { canvas } from "../script.js"

let pointsCount = 0
let polylinePoints = []

export function startDrawLine() {
	canvas.on('mouse:down', drawCircle)  
	canvas.on('mouse:move', drawTempCircle)  
	canvas.on('mouse:dblclick', stopDraw)
}

function getCoords(e) {
	let coords = canvas.getPointer(e)
  return {x:coords.x, y:coords.y}
}

function drawCircle(e) {
	canvas.off('mouse:move')
  canvas.off('mouse:down')
	pointsCount++
  createCircle(e, false)  
  deleteAllButOne('circle')
  polylinePoints.push(getCoords(e))
  canvas.on('mouse:down', incPoints)
  canvas.on('mouse:move', drawTempPolyline)
}

function incPoints(e) {
  polylinePoints.push(getCoords(e))
   pointsCount++
 }

 function deleteAllButOne(shapeToDelete) {
	let objs = canvas.getObjects()
  canvas.remove(objs[objs.length - 1])
}

function drawTempPolyline(e) {
	// smazat stary
  let objs = canvas.getObjects('polyline')
  objs.filter(obj => {
  	if (obj.isTemp == true) {
    	canvas.remove(obj)
    } 
  })  
  // vykreslit novy
  createPolyline(e, true)
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

function createPolyline(e, isTemp) {
    polylinePoints[pointsCount] = getCoords()
    let polyline = new fabric.Polyline(polylinePoints, {
      strokeWidth: 3,
      /* hasBorders: false,
      hasControls: false, */
      stroke:"rgba(245,36,47,0.9)", 
      fill:'transparent',
      strokeLineJoin: 'round',
      /* hoverCursor:'default',
      moveCursor:'default', */
      isTemp: isTemp
    })
    canvas.add(polyline)
  }
  function createCircle(e, isTemp) {
    let coords = getCoords(e)
    let circle = new fabric.Circle({
      fill: "rgba(245,36,47,0.9)",
      radius: 2,
      /* hasBorders: false,
      hasControls: false, */
      left: coords.x - 2,
      top: coords.y - 2,
      /* hoverCursor:'default',
      moveCursor:'default', */
      isTemp: isTemp
    })
    canvas.add(circle)
  }
  
  function stopDraw() {
    let polylines = canvas.getObjects('polyline')
    polylines.forEach(obj => obj.isTemp = false)    
    removeAllCircles()
    polylinePoints = []
    pointsCount = 0
    canvas.off('mouse:move')
    canvas.off('mouse:down')
  }

  function removeAllCircles() {
   let objs = canvas.getObjects('circle')
    objs.forEach(obj => { 
        if (obj.isTemp) {
          canvas.remove(obj)  
        }    
    })  
  }
