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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/display-range.js":
/*!******************************!*\
  !*** ./src/display-range.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const hebrewNumeralFromInteger = __webpack_require__(/*! ./hebrew-numeral */ \"./src/hebrew-numeral.js\")\n\nvar asRange = (strings) => {\n  if (!strings.length) {\n    return ''\n  }\n\n  if (strings.length === 1) {\n    return strings[0]\n  }\n\n  return [strings[0], strings[strings.length - 1]].join('-')\n}\n\nconst aliyotStrings = [\n  \"ראשון\",\n  \"שני\",\n  \"שלישי\",\n  \"רביעי\",\n  \"חמישי\",\n  \"ששי\",\n  \"שביעי\",\n  \"מפטיר\"\n]\n\nvar aliyotNames = (aliyot) => aliyot\n  .filter((aliyah) => aliyah > 0 && aliyah <= aliyotStrings.length)\n  .map((aliyah) => aliyotStrings[aliyah - 1])\n\nconst asVersesRange = (verses) => asRange(verses.map((verse) => {\n  const components = []\n\n  if (verse.verse === 1) {\n    components.push(verse.chapter)\n  }\n\n  components.push(verse.verse)\n\n  return components\n    .map((num) => hebrewNumeralFromInteger(num))\n    .join(':')\n}))\n\nconst asAliyotRange = (aliyot) => {\n  if (!aliyot.length) {\n    return ''\n  }\n\n  const aliyotByName = aliyotNames(aliyot)\n\n  return aliyotByName[0] + (aliyotByName[1] ? ` [${aliyotByName[1]}]` : '')\n}\n\n\n//# sourceURL=webpack:///./src/display-range.js?");

/***/ }),

/***/ "./src/hebrew-numeral.js":
/*!*******************************!*\
  !*** ./src/hebrew-numeral.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const letters = [\n    {glyph: 'א', value: 1},\n    {glyph: 'ב', value: 2},\n    {glyph: 'ג', value: 3},\n    {glyph: 'ד', value: 4},\n    {glyph: 'ה', value: 5},\n    {glyph: 'ו', value: 6},\n    {glyph: 'ז', value: 7},\n    {glyph: 'ח', value: 8},\n    {glyph: 'ט', value: 9},\n    {glyph: 'י', value: 10},\n    {glyph: 'כ', value: 20},\n    {glyph: 'ל', value: 30},\n    {glyph: 'מ', value: 40},\n    {glyph: 'נ', value: 50},\n    {glyph: 'ס', value: 60},\n    {glyph: 'ע', value: 70},\n    {glyph: 'פ', value: 80},\n    {glyph: 'צ', value: 90},\n    {glyph: 'ק', value: 100},\n    {glyph: 'ר', value: 200},\n    {glyph: 'ש', value: 300},\n    {glyph: 'ת', value: 400}\n]\n  .reverse()\n\nconst hebrewNumeral = (n) => {\n  if (n <= 0) return ''\n  if (n === 15) return 'טו'\n  if (n === 16) return 'טז'\n\n  let i = 0\n  while (n < letters[i].value) {\n    ++i\n  }\n\n  const letter = letters[i]\n\n  return `${letter.glyph}${hebrewNumeral(n - letter.value)}`\n}\n\nmodule.exports = hebrewNumeral\n\n\n//# sourceURL=webpack:///./src/hebrew-numeral.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const hebrewNumeralFromInteger = __webpack_require__(/*! ./hebrew-numeral */ \"./src/hebrew-numeral.js\")\nconst textFilter = __webpack_require__(/*! ./text-filter */ \"./src/text-filter.js\")\nconst displayRange = __webpack_require__(/*! ./display-range */ \"./src/display-range.js\")\n\nwindow.TikkunApp = window.TikkunApp || {textFilter, hebrewNumeralFromInteger, displayRange}\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/text-filter.js":
/*!****************************!*\
  !*** ./src/text-filter.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const ketiv = (text) => text\n  .replace('#(פ)', '')\n  .split(' ')\n  .map((word) => {\n    const parts = word.split('#')\n\n    if (parts.length <= 1) {\n      return parts[0]\n    }\n\n    return parts[1].slice(1, -1)\n  })\n  .join(' ')\n\nconst kri = (text) => text\n  .replace(/־/g, ' ')\n  .replace('#(פ)', '')\n  .split(' ')\n  .map((word) => {\n    const parts = word.split('#')\n\n    return parts[0]\n  })\n  .join(' ')\n  .replace(/[^א-ת\\s]/g, '')\n\nmodule.exports = ({text, annotated}) => annotated ? ketiv(text) : kri(text)\n\n\n//# sourceURL=webpack:///./src/text-filter.js?");

/***/ })

/******/ });