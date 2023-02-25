import { resetZoom } from './map.js';

let optionWrap;

function showOptionsWrap(e) {
  optionWrap.style.display == 'none' ? optionWrap.style.display = 'flex' : optionWrap.style.display = 'none';
}

function hideOptionsWrap(e) {
  if (!e.target.matches('.shape-options-wrap')) {
    if (optionWrap.style.display == 'flex') optionWrap.style.display = 'none';
  }
}

export function initMapIcons() {
  document.querySelector('.resize-icon-all').addEventListener('click', resetZoom);
  optionWrap = document.querySelector('.shape-options-wrap');
  optionWrap.style.display = 'none';
  document.querySelector('#add-button-wrap').addEventListener('input', showOptionsWrap);
  document.addEventListener('click', hideOptionsWrap);
}