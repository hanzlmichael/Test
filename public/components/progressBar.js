export function initProgressBar() {
  previousBtn.onclick = previousPage
  nextBtn.onclick = nextPage
}
let previousBtn = document.querySelector('#previous-page')
let nextBtn = document.querySelector('#next-page')
let dots = document.querySelectorAll('.circle-wrap .dot')
let texts = document.querySelectorAll('.circle-wrap .circle-text')
let line = document.querySelector('.progress-line')
let pages = document.querySelector('.pages').children
let count = 0

function previousPage() {
  if (isCountInvalid(count, -1)) return 
  dots[count].classList.remove('dot-active')
  findActiveAndDeactivate()   
  count--;
  displayPage(count)
  displayCorrectLine(count)
  texts[count].classList.add('circle-text-active')  
}

function nextPage() {
  debugger;
  if (isCountInvalid(count, 1)) return 
  count++
  displayPage(count)
  displayCorrectLine(count)
  dots[count].classList.add('dot-active')
  findActiveAndDeactivate()
  texts[count].classList.add('circle-text-active')
}

function findActiveAndDeactivate() {
  texts.forEach(el=> {
    if (el.classList.contains('circle-text-active')) {
      el.classList.remove('circle-text-active')
    }
  })
}

function displayCorrectLine(count) {
  line.className = ''
  line.classList.add('progress-line', `line-active${count}`)
}

function isCountInvalid(count, num) {
  let temp = count + num
  console.log('temp: ', temp)
  let exists = texts?.[temp]
  console.log('exists: ', exists)
  if (exists !== undefined) return false
  return true
}
  
function displayPage(count) {
  for (let i = 0; i < 4; i++) {
    pages[i].style.display = 'none';
  }
  pages[count].style.display = 'block'
 
  /* for (item of pages) {
    item.style.display = 'none'
  }
  pages[count].style.display = 'block' */
}