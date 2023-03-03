import { createAnswerWrap } from '../components/answer.js';
import { canvas } from '../script.js';
import { resizeMapToCanvas } from '../script.js';

export function initQuestionsBar() {
  debugger;
  document.querySelector('.create-questions-panel').style.display = 'none';  
  document.querySelector('#add-new-question').addEventListener('click', addNewQuestion)
  document.querySelector('#delete-question').addEventListener('click', deleteQuestion);
  document.querySelector('.wrap-questions').addEventListener('input', changeQuestion);
  test = new Test("", questions, maps);
  saveTestBtn.addEventListener('click', handleTestInDb);
  //document.querySelector('#testbtn').addEventListener('click', saveQuestion);
}

let wrapQuestionsElem = document.querySelector('.wrap-questions');
console.log('wrap q : ', wrapQuestionsElem.children.length)
let actualQuestionIndex = -1;
let questionNumber = wrapQuestionsElem.children.length > 1 ? wrapQuestionsElem.children.length - 1 : 0;

export let maps = [];
export let test;
let questions = [];

let testTitle = document.querySelector('#test-name-wrap input')
let saveTestBtn = document.querySelector('#saveTest');

function handleTestInDb() {
  let url = window.location.href;
  const lastString = url.split("/").pop();
  console.log('laststring ',lastString)
  if (lastString == 'new') {
    console.log('savetesttodb')
    saveTestToDb();
  } else {
    console.log('updatetestindb')
    updateTestInDb(lastString);
  }
}

export function getTestById() {
  debugger;
  let url = window.location.href;
  const lastString = url.split("/").pop();
  fetch(`/tests/${lastString}/edit`, {
      method: 'GET',
      credentials: 'include'
    }).then(response=>response.json())
      .then(data=> {
        console.log(data);
        test = data.test;
        console.log('test OBJ : ', test);
        actualQuestionIndex = 0;
        if (test.questions.length > 0) {
          displayQuestion();
        } else {
          actualQuestionIndex = -1;
        }
      })
     
}

function getMarksBoundaries() {
  let inputs = document.querySelectorAll('.table-input-number')
  let values = []
  inputs.forEach(el => values.push(el.value))
  return values;
}

async function saveTestToDb() {
  try {
    let title = testTitle.value;
    let categories = getTags();
    let timeLimit = document.querySelector('#selectTimeLimit').value;
    let marksBoundaries = getMarksBoundaries();
    const res = await fetch('/tests/new', {
      method: 'POST', 
      body: JSON.stringify( { title, categories, test, marksBoundaries, timeLimit } ),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
    if (res) {
      console.log('res : ', res)
      location.assign('/tests')
    }
  }
  catch (err) {
    console.log(err)
  }
}
async function updateTestInDb(id) {
  try {
    console.log('yes')
    let title = testTitle.value;
    let categories = getTags();
    let timeLimit = document.querySelector('#selectTimeLimit').value;
    let marksBoundaries = getMarksBoundaries();
    console.log('id ', id);
    let fetchUrl = '/tests/' + id;
    console.log('fetchurl ', fetchUrl)
    const res = await fetch(fetchUrl, {
      method: 'PUT', 
      body: JSON.stringify( { title, categories, test, marksBoundaries, timeLimit } ),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
    if (res) {
      console.log('res : ', res)
      location.assign('/tests')
    }
  }
  catch (err) {
    console.log(err)
  }
}



function addNewQuestion() {
  debugger;
  if (questionNumber == 0) 
    displayPanel();
  if (actualQuestionIndex != -1) 
    saveQuestion(); // TODO
  questionNumber++;
  actualQuestionIndex++;
  createQuestionIcon();
  setLastQuestionAsChecked();
  test.questions.push(new Question(null, null, null, 1, null));
  if (questionNumber > 1)
    resetQuestion();
  console.log(test);
}

function saveQuestion() {
  debugger;
  removeMapFromCanvas();
  test.questions[actualQuestionIndex].map = getMap();
  test.questions[actualQuestionIndex].category = getCategory();
  test.questions[actualQuestionIndex].answers = getAnswers();
  test.questions[actualQuestionIndex].points = getPoints();
  test.questions[actualQuestionIndex].shapes = JSON.stringify(canvas);
  console.log(test);
}

function changeQuestion(e) {
  debugger;
  if (e.target.matches('.wrap-questions input')) {
    saveQuestion();
    actualQuestionIndex = e.target.dataset.questionindex;
    displayQuestion();
  }
}

function displayQuestion() {
  debugger;
  let map = test.questions[actualQuestionIndex].map;
  let category = test.questions[actualQuestionIndex].category;
  let answers = test.questions[actualQuestionIndex].answers;
  let points = test.questions[actualQuestionIndex].points;
  let shapes = test.questions[actualQuestionIndex].shapes;

  setMap(map);
  setCategory(category);
  setAnswers(answers);
  setPoints(points);
  if (shapes === null) {
    canvas.clear();
    return;
  }
  canvas.loadFromJSON(shapes);
/* 
  setMap(map);
  setCategory();
  setAnswers();
  setPoints(); */
  
}

function deleteQuestion() {
  debugger;
  document.querySelector('.wrap-questions span:last-of-type').remove();
  test.questions.splice(actualQuestionIndex, 1);
  if (Number(actualQuestionIndex) + 1 == questionNumber) {
    actualQuestionIndex--;
    if (actualQuestionIndex > -1) {
      setLastQuestionAsChecked()
    }
  }
  questionNumber--;
  if (questionNumber == 0) {
    hidePanel();
    return;
  }
  displayQuestion()
}


/* function deleteQuestion(e) {
  debugger;

  let questionIndexDeleted = getActualQuestion(); 
  questionNumber--;
  document.querySelector('.wrap-questions span:last-of-type').remove();
  if (questionIndexDeleted == questionCount + 1) {
    if (questionCount == 0) {
      togglePanel();
      return;
    }
    setLastQuestionAsChecked()
  }
  togglePanel()
} */

function createQuestionIcon() {
  let newQuestionElem = `<span><input type="radio" id="question${questionNumber}" data-questionindex="${actualQuestionIndex}" name="question">
  <label for="question${questionNumber}">${questionNumber}</label></span>`;
  let addQuestion = document.querySelector('#add-new-question') 
  addQuestion.insertAdjacentHTML('beforebegin', newQuestionElem);  
}

function setLastQuestionAsChecked() {
  document.querySelector('.wrap-questions span:last-of-type input').checked = true
}

function getActualQuestion() {
  return document.querySelector('.wrap-questions input:checked').dataset.questionnumber;
}


let pointElement = document.querySelector('#point-value')
let categoryElement = document.querySelector('#select-category')
let mapElement = document.querySelector('#select-map')
console.log('mapElement: ', mapElement);
let answersWrap = document.querySelector('.answers-wrap')

let questionIconWrap = document.querySelector('.wrap-questions');


function removeMapFromCanvas() {
  let objs = canvas.getObjects();
  objs.forEach(obj => {
 	if (obj.type == 'image') {
   	canvas.remove(obj)
  }
 })
}


// Schovat panel otázky pokud není vytvořená žádná otázka
function togglePanel() {
  debugger;
  let panel =  document.querySelector('.create-questions-panel')

  if (questionNumber > 1) {      
    panel.style.display = 'grid';
  } else {
    panel.style.display = 'none';
  }
}

let panel =  document.querySelector('.create-questions-panel')
function displayPanel() {
  panel.style.display = 'flex';
}
function hidePanel() {
  panel.style.display = 'none';
}

// nastaveni bodů
function getPoints() {
  return pointElement.textContent;
}
function setPoints(value) {
  console.log(pointElement)
  pointElement.textContent = value;
}
function setDefaultPoints() {
  pointElement.textContent = 1;
}

// nastavení kategorie
function getCategory() {
  let selectedValue = categoryElement.item(categoryElement.selectedIndex);
  return selectedValue.value;
}

function setCategory(category) {
  if (category === null) {
    return;
  }
  categoryElement.value = category;
} 
function setDefaultCategory() {
  categoryElement.item(0).selected = true;
}

// nastavení odpovědí
function getAnswers() {
  debugger;
  let answerWraps = document.querySelectorAll('.answer-wrap')
  let allAnswers = []
  answerWraps.forEach(item => {
    let answerTerm = item.querySelector('input').value
    let isCorrect = item.querySelector('.answer-checkbox input').checked
    let obj = {
      term: answerTerm,
      isCorrect: isCorrect 
    }
    allAnswers.push(obj)
  })
  return allAnswers
}
function setAnswers(allAnswers) {
  debugger;
  if (allAnswers === null || allAnswers === "null") {
    return;
  }
  answersWrap.innerHTML = ''
  allAnswers.forEach(question => {
    createAnswerWrap();
    let answer = answersWrap.querySelector('.answer-wrap:last-of-type')
    answer.querySelector('input').value = question.term
    answer.querySelector('.answer-checkbox input').checked = question.isCorrect
    if (answer.querySelector('.answer-checkbox input').checked) 
      answer.classList.add('answer-wrap-green');
  })
}

function setDefaultAnswers() {
  answersWrap.innerHTML = ''
}

function getMap() {
  console.log(mapElement.item(mapElement.selectedIndex).value);
  console.log(mapElement.item(mapElement.selectedIndex));

  return mapElement.item(mapElement.selectedIndex).value
}
function setMap(mapId) {
  if (mapId === null || mapId === "null") {
    mapElement.selectedIndex = 0;
    return;
  }
  mapElement.value = mapId
  let maps = test.maps;
  let map = maps.find(map => map.mapId == mapId)
  resizeMapToCanvas(map.src)
 /*  mapElement.dispatchEvent(new Event('change')); */
}
function setDefaultMap() {
  mapElement.selectedIndex = 0
  canvas.clear()
}

function getCanvasObjects() {

}

function resetQuestion() {
  setDefaultPoints()
  setDefaultCategory()
  setDefaultAnswers()
  setDefaultMap()
}
function testing() {
  getAnswers()
}

/*  classes */
class Test {
  constructor(title, questions, maps) {
    this.title = title;
    this.questions = questions;
    this.maps = maps;
  }
}

class Map {
  constructor(mapId, src) {
    this.mapId = mapId;
    this.src = src;
  }
}

class Question {
  constructor(category, map, answers, points, shapes) {
    this.category = category;
    this.map = map;
    this.answers = answers;
    this.points = points;
    this.shapes = shapes;
  }
}

class Answer {
  constructor(term, isCorrect) {
    this.term = term;
    this.isCorrect = isCorrect;
  }
}
