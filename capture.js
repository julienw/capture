/*jshint browser: true, strict: true, esnext: true  */

(function() {
'use strict';

var videoElt = document.querySelector('.captured-video');
var containers = {
  mirror: document.querySelector('.mirror-container'),
  rotate: document.querySelector('.rotate-container')
};
var formElt = document.querySelector('.effects-form');

var innerWidth = window.innerWidth;
var idealWidth = innerWidth < 800 ? innerWidth : innerWidth * 0.66;
var constraints = { audio: false, video: { width: { ideal: idealWidth, max: innerWidth } } };
var webkitConstraints = { audio: false ,video: { optional: [{ maxWidth : innerWidth }], mandatory: {}}};
var simpleConstraints = { audio: false, video: true };

function onEffectChange() {
  console.log('onEffectChange()');
  var effects = [
    'rotate-no',
    'rotate-90',
    'rotate-180',
    'rotate-270',
    'mirror-horizontal',
    'mirror-vertical'
  ];

  effects.forEach(function(effect) {
    var checked = document.querySelector(`.form-${effect}`).checked;
    var effectType = effect.slice(0, effect.indexOf('-'));
    containers[effectType].classList.toggle(`effect-${effect}`, checked);
  });
}

function addEventHandlers() {
  formElt.addEventListener('change', onEffectChange);
}

function startCapture() {
  console.log('startCapture()');
  return navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    console.log('startCapture() promise handler');
    videoElt.src = window.URL.createObjectURL(stream);
    videoElt.onloadedmetadata = function(e) {
      videoElt.play();
    };
  });
}

function initMediaDevicesPolyfill() {
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
      getUserMedia: function(constraints) {
        console.log('getUserMedia() polyfill');
        return new Promise(function(resolve, reject) {
          var userMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
          try {
            userMedia.call(navigator, constraints, resolve, reject);
          } catch(e) {
            console.log('caught exception', e.name);
            console.log('retrying with a webkit specific constraint object.');
            // looks like webkit doesn't like our constraint object
            userMedia.call(navigator, webkitConstraints, resolve, reject);
          }
        });
      }
    } : null);
  }
}

function init() {
  initMediaDevicesPolyfill();
  addEventHandlers();
  onEffectChange(); // browsers can remember a previous state at reload

  return startCapture();
}

init().catch(function(e) {
  console.error('Got an error while capturing video', e, e.name);
});

})();
