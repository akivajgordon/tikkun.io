/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const hebrewNumeralFromInteger = __webpack_require__(1)

window.hebrewNumeralFromInteger = window.hebrewNumeralFromInteger || hebrewNumeralFromInteger


/***/ }),
/* 1 */
/***/ (function(module, exports) {

const letters = [
    {glyph: 'א', value: 1},
    {glyph: 'ב', value: 2},
    {glyph: 'ג', value: 3},
    {glyph: 'ד', value: 4},
    {glyph: 'ה', value: 5},
    {glyph: 'ו', value: 6},
    {glyph: 'ז', value: 7},
    {glyph: 'ח', value: 8},
    {glyph: 'ט', value: 9},
    {glyph: 'י', value: 10},
    {glyph: 'כ', value: 20},
    {glyph: 'ל', value: 30},
    {glyph: 'מ', value: 40},
    {glyph: 'נ', value: 50},
    {glyph: 'ס', value: 60},
    {glyph: 'ע', value: 70},
    {glyph: 'פ', value: 80},
    {glyph: 'צ', value: 90},
    {glyph: 'ק', value: 100},
    {glyph: 'ר', value: 200},
    {glyph: 'ש', value: 300},
    {glyph: 'ת', value: 400}
]
  .reverse()

const hebrewNumeral = (n) => {
  if (n <= 0) return ''
  if (n === 15) return 'טו'
  if (n === 16) return 'טז'

  let i = 0
  while (n < letters[i].value) {
    ++i
  }

  const letter = letters[i]

  return `${letter.glyph}${hebrewNumeral(n - letter.value)}`
}

module.exports = hebrewNumeral


/***/ })
/******/ ]);