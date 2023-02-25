export function initPoints() {
  document.querySelector('#inc-point').addEventListener('click', incPoint)
  document.querySelector('#dec-point').addEventListener('click', decPoint)
  startObservingPointValue() 
}

let pointValue = document.querySelector('#point-value')

function startObservingPointValue() {
  console.log('here')
  mutationPointObserver.observe(pointValue, {
    childList: true,
    characterData: true
    }) 
}

function incPoint() {
  pointValue.textContent = (Number(pointValue.textContent) + 1)
}
function decPoint() {
  pointValue.textContent = pointValue.textContent - 1
}

const mutationPointObserver = new MutationObserver((mutations) => {
  mutations.forEach(function (mutation) {
    
    if (mutation.addedNodes.length) {
      console.log('Added', mutation.addedNodes[0].data)
      if (Number(mutation.addedNodes[0].data) < 2 ) {
        console.log('yes')
      	pointValue.textContent = 1
        document.querySelector('#dec-class').classList.add('disabled')
      } else {
        document.querySelector('#dec-class').classList.remove('disabled')
      }      
      if (Number(mutation.addedNodes[0].data) > 9) {
        pointValue.textContent = 10
          document.querySelector('#inc-class').classList.add('disabled')
      } else {
        document.querySelector('#inc-class').classList.remove('disabled')
      }
    }
  })
})