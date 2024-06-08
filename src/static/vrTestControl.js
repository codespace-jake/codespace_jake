/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/vrTestControl.js":
/*!************************************!*\
  !*** ./assets/js/vrTestControl.js ***!
  \************************************/
/***/ (function() {

eval("// Place url of your deployed app here\nconst myUrl = \"https://65574cfd7abbc6110e054aa6--statuesque-dusk-5500ef.netlify.app/\";\nconst horizontalRatio = 16 / 9;\nconst verticalRatio = 3 / 4;\n$(document).ready(function () {\n  makeWalkthrough();\n});\nvar myOrientation;\nfunction makeWalkthrough() {\n  const myWidth = window.innerWidth;\n  const myHeight = window.innerHeight;\n  let horizPadd;\n  let newHeight;\n  if (myWidth < 768) {\n    horizPadd = 6;\n  } else {\n    horizPadd = 11;\n  }\n  const newWidth = 100 - horizPadd * 2;\n  if (myHeight > myWidth) {\n    newHeight = horizontalRatio * newWidth;\n    myOrientation = \"vert\";\n  } else {\n    newHeight = verticalRatio * newWidth;\n    myOrientation = \"horz\";\n  }\n\n  // Insert window for walkthrough\n  var marzipanoWindow = document.createElement(\"iframe\");\n  marzipanoWindow.style = `height:${newHeight}vw; width:${newWidth}vw`;\n  marzipanoWindow.src = `${myUrl}/index.html`;\n  $(\"#walkthrough\").append(marzipanoWindow);\n}\n$(window).resize(function () {\n  if (window.innerHeight > window.innerWidth && myOrientation === \"horz\") {\n    $(\"#walkthrough\").empty();\n    makeWalkthrough();\n  } else if (window.innerHeight < window.innerWidth && myOrientation === \"vert\") {\n    $(\"#walkthrough\").empty();\n    makeWalkthrough();\n  }\n});\n// script for Screenful\nvar scriptScreenful = document.createElement(\"script\");\nscriptScreenful.type = \"text/javascript\";\nscriptScreenful.src = `${myUrl}/vendor/screenfull.min.js`;\n$(\"head\").append(scriptScreenful);\n// script for Classlist\nvar scriptClassList = document.createElement(\"script\");\nscriptClassList.type = \"text/javascript\";\nscriptClassList.src = `${myUrl}/vendor/classList.js`;\n$(\"head\").append(scriptClassList);\n// script for bowser\nvar scriptBowser = document.createElement(\"script\");\nscriptBowser.type = \"text/javascript\";\nscriptBowser.src = `${myUrl}/vendor/bowser.min.js`;\n$(\"head\").append(scriptBowser);\n// script for es5\nvar scriptEs5 = document.createElement(\"script\");\nscriptEs5.type = \"text/javascript\";\nscriptEs5.src = `${myUrl}/vendor/es5-shim.js`;\n$(\"head\").append(scriptEs5);\n// script for events\nvar scriptEvent = document.createElement(\"script\");\nscriptEvent.type = \"text/javascript\";\nscriptEvent.src = `${myUrl}/vendor/eventShim.js`;\n$(\"head\").append(scriptEvent);\n// script for animation\nvar scriptAnimation = document.createElement(\"script\");\nscriptAnimation.type = \"text/javascript\";\nscriptAnimation.src = `${myUrl}/vendor/requestAnimationFrame.js`;\n$(\"head\").append(scriptAnimation);\n// script for Marzipano\nvar scriptMarzipano = document.createElement(\"script\");\nscriptMarzipano.type = \"text/javascript\";\nscriptMarzipano.src = `${myUrl}/vendor/marzipano.js`;\n$(\"head\").append(scriptMarzipano);\n\n//# sourceURL=webpack:///./assets/js/vrTestControl.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./assets/js/vrTestControl.js"]();
/******/ 	
/******/ })()
;