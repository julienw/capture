/*jshint browser: true, strict: true, esnext: true  */

(function() {
'use strict';

var videoElt = document.querySelector('.captured-video');
var containers = {
  mirror: document.querySelector('.mirror-container'),
  rotate: document.querySelector('.rotate-container')
};
var formElt = document.querySelector('.effects-form');

var constraints = { audio: false, video: { width: 720, height: 720 } };

function onEffectChange() {
  var effects = [
    'rotate-no',
    'rotate-90',
    'rotate-180',
    'rotate-270',
    'mirror-horizontal',
    'mirror-vertical'
  ];

  effects.forEach(effect => {
    var checked = document.querySelector(`.form-${effect}`).checked;
    var effectType = effect.slice(0, effect.indexOf('-'));
    containers[effectType].classList.toggle(`effect-${effect}`, checked);
  });
}

function addEventHandlers() {
  formElt.addEventListener('change', onEffectChange);
}

function startCapture() {
  return navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    videoElt.src = window.URL.createObjectURL(stream);
    videoElt.onloadedmetadata = function(e) {
      videoElt.play();
    };
  });
}

function init() {
  addEventHandlers();
  onEffectChange(); // browsers can remember a previous state at reload

  return startCapture();
}

init().catch(e => console.error('Got an error while capturing video', e, e.name));

})();
