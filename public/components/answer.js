export function initAnswer() {
  let asnwerWrap = document.querySelector('#add-answer-wrap');
  asnwerWrap.addEventListener('click', createAnswerWrap);  
  document.querySelector('.answers-wrap').addEventListener('click', removeAnswerWrap);
}

export function createAnswerWrap() {
  let asnwerWrap = document.querySelector('.answers-wrap')
  let parent = asnwerWrap;
  let html = `<div class="answer-wrap">
  <input class="answer-text" placeholder="Odpověď"></input>
  <button class="close-term">×</button>
  <div class="answer-checkbox">
    <input type="checkbox" name="check" onclick="onlyOne(this)">
    <span>správná odpověď</span>
  </div>
</div>`
  parent.insertAdjacentHTML('beforeend', html);
}

function removeAnswerWrap(e) {
  if (e.target.matches('.close-term')) {
    e.target.closest('.answer-wrap').remove();
  }
}

// TODO GENEROVANI MOŽNOSTI
