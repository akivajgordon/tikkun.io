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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/parshiyot.json":
/*!******************************!*\
  !*** ./build/parshiyot.json ***!
  \******************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, default */
/***/ (function(module) {

eval("module.exports = [{\"he\":\"בראשית\",\"page\":1},{\"he\":\"נח\",\"page\":6},{\"he\":\"לך לך\",\"page\":12},{\"he\":\"וירא\",\"page\":17},{\"he\":\"חיי שרה\",\"page\":23},{\"he\":\"תולדות\",\"page\":27},{\"he\":\"ויצא\",\"page\":31},{\"he\":\"וישלח\",\"page\":37},{\"he\":\"וישב\",\"page\":42},{\"he\":\"מקץ\",\"page\":47},{\"he\":\"ויגש\",\"page\":53},{\"he\":\"ויחי\",\"page\":57},{\"he\":\"שמות\",\"page\":61},{\"he\":\"וארא\",\"page\":66},{\"he\":\"בא\",\"page\":71},{\"he\":\"בשלח\",\"page\":76},{\"he\":\"יתרו\",\"page\":81},{\"he\":\"משפטים\",\"page\":84},{\"he\":\"תרומה\",\"page\":89},{\"he\":\"תצוה\",\"page\":92},{\"he\":\"כי תשא\",\"page\":97},{\"he\":\"ויקהל\",\"page\":103},{\"he\":\"פקודי\",\"page\":108},{\"he\":\"ויקרא\",\"page\":111},{\"he\":\"צו\",\"page\":117},{\"he\":\"שמיני\",\"page\":121},{\"he\":\"תזריע\",\"page\":124},{\"he\":\"מצורע\",\"page\":127},{\"he\":\"אחרי מות\",\"page\":131},{\"he\":\"קדושים\",\"page\":135},{\"he\":\"אמור\",\"page\":137},{\"he\":\"בהר\",\"page\":143},{\"he\":\"בחקתי\",\"page\":145},{\"he\":\"במדבר\",\"page\":148},{\"he\":\"נשא\",\"page\":154},{\"he\":\"בהעלותך\",\"page\":162},{\"he\":\"שלח\",\"page\":168},{\"he\":\"קרח\",\"page\":172},{\"he\":\"חקת\",\"page\":177},{\"he\":\"בלק\",\"page\":180},{\"he\":\"פנחס\",\"page\":185},{\"he\":\"מטות\",\"page\":191},{\"he\":\"מסעי\",\"page\":196},{\"he\":\"דברים\",\"page\":200},{\"he\":\"ואתחנן\",\"page\":205},{\"he\":\"עקב\",\"page\":211},{\"he\":\"ראה\",\"page\":217},{\"he\":\"שופטים\",\"page\":223},{\"he\":\"כי תצא\",\"page\":227},{\"he\":\"כי תבוא\",\"page\":232},{\"he\":\"נצבים\",\"page\":238},{\"he\":\"וילך\",\"page\":240},{\"he\":\"האזינו\",\"page\":242},{\"he\":\"וזאת הברכה\",\"page\":244}];\n\n//# sourceURL=webpack:///./build/parshiyot.json?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src */ \"./src/index.js\");\n/* harmony import */ var _build_parshiyot_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./build/parshiyot.json */ \"./build/parshiyot.json\");\nvar _build_parshiyot_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./build/parshiyot.json */ \"./build/parshiyot.json\", 1);\n\n\n\nconst petuchaClass = (isPetucha) => isPetucha ? 'mod-petucha' : ''\n\nconst setumaClass = (column) => column.length > 1 ? 'mod-setuma' : ''\n\nconst Line = ({ text, verses, aliyot, isPetucha }, annotated) => `\n  <div class=\"line ${petuchaClass(isPetucha)}\">\n    ${text.map((column) => (`\n      <div class=\"column\">\n        ${column.map((fragment) => (`\n          <span class=\"fragment ${setumaClass(column)}\">${Object(_src__WEBPACK_IMPORTED_MODULE_0__[\"textFilter\"])({ text: fragment, annotated })}</span>\n        `)).join('')}\n      </div>\n    `)).join('')}\n    <span class=\"location-indicator mod-verses\" hidden=\"${!annotated}\">${_src__WEBPACK_IMPORTED_MODULE_0__[\"displayRange\"].asVersesRange(verses)}</span>\n    <span class=\"location-indicator mod-aliyot\" hidden=\"${!annotated}\">${_src__WEBPACK_IMPORTED_MODULE_0__[\"displayRange\"].asAliyotRange(aliyot)}</span>\n  </div>\n`\n\nconst Page = (lines, annotated) => `\n  <div class=\"tikkun-page\">\n    <table>\n      ${lines.map((line) => (`\n        <tr>\n          <td>${Line(line, annotated)}</td>\n        </tr>\n      `)).join('')}\n    </table>\n  </div>\n`\n\nconst ParshaPicker = () => `\n  <div class=\"parsha-picker\">\n    <ol class=\"parsha-list\">\n      ${_build_parshiyot_json__WEBPACK_IMPORTED_MODULE_1__.map(({ he, page }) => (`<li class=\"parsha\" data-target-id=\"parsha\" data-jump-to-page=\"${page}\">${he}</li>`)).join('')}\n    </ol>\n  </div>\n`\n\nconst insertBefore = (parent, child) => {\n  parent.insertAdjacentElement('afterbegin', child)\n}\n\nconst insertAfter = (parent, child) => {\n  parent.insertAdjacentElement('beforeend', child)\n}\n\nconst fetchPage = (n) => {\n  if (n <= 0) return Promise.resolve({})\n\n  return window.fetch(`/build/pages/${n}.json`)\n    .then((res) => res.json())\n    .then((page) => ({ key: n, content: page }))\n    .catch((err) => {\n      console.error(err)\n      return {}\n    })\n}\n\nconst iterator = _src__WEBPACK_IMPORTED_MODULE_0__[\"IntegerIterator\"].new({ startingAt: 1 })\n\nconst cache = {}\n\nconst unpackCache = (cache) => Object.keys(cache).map(key => cache[key])\n\nlet isShowingParshaPicker = false\n\nconst htmlToElement = (html) => {\n  const template = document.createElement('template')\n  html = html.trim() // Never return a text node of whitespace as the result\n  template.innerHTML = html\n  return template.content.firstChild\n}\n\nconst state = {}\n\nconst render = ({ cache, showAnnotations }) => {\n  unpackCache(cache)\n    .forEach(({ node, content }) => {\n      const el = htmlToElement(Page(content, showAnnotations))\n\n      const firstChild = node.firstChild\n      if (firstChild) {\n        node.replaceChild(el, firstChild)\n      } else {\n        node.appendChild(el)\n      }\n    })\n}\n\nconst setState = (updates) => {\n  const newState = Object.assign(state, updates)\n\n  render(newState)\n}\n\nconst emptyObject = (obj) => {\n  for (const key in obj) {\n    delete obj[key]\n  }\n}\n\nconst emptyNode = (node) => {\n  while (node.firstChild) node.removeChild(node.firstChild)\n}\n\nconst showParshaPicker = () => {\n  document.querySelector('#js-app').appendChild(htmlToElement(ParshaPicker()))\n  ;[...document.querySelectorAll('[data-target-id=\"parsha\"]')]\n    .forEach((parsha) => {\n      parsha.addEventListener('click', (e) => {\n        const page = e.target.getAttribute('data-jump-to-page')\n\n        emptyObject(cache)\n        const iterator = _src__WEBPACK_IMPORTED_MODULE_0__[\"IntegerIterator\"].new({ startingAt: Number(page) })\n\n        emptyNode(document.querySelector('[data-target-id=\"tikkun-book\"]'))\n\n        fetchPage(iterator.next())\n          .then(({ key, content }) => {\n            const node = document.createElement('div')\n            cache[key] = { node, content }\n            insertAfter(document.querySelector('[data-target-id=\"tikkun-book\"]'), node)\n\n            setState({ cache, showAnnotations: document.querySelector('[data-target-id=\"annotations-toggle\"]').checked })\n          })\n\n        document.querySelector('[data-target-id=\"parsha-title\"]').innerHTML = e.target.textContent\n        toggleParshaPicker()\n      })\n    })\n}\n\nconst toggleParshaPicker = () => {\n  isShowingParshaPicker = !isShowingParshaPicker\n\n  ;[\n    '[data-test-id=\"annotations-toggle\"]',\n    '[data-target-id=\"repo-link\"]',\n    '[data-target-id=\"tikkun-book\"]'\n  ]\n    .map(selector => document.querySelector(selector))\n    .map(el => el.classList)\n    .forEach(classList => {\n      classList.toggle('u-hidden')\n      classList.toggle('mod-animated')\n    })\n\n  if (isShowingParshaPicker) {\n    showParshaPicker()\n  } else {\n    document.querySelector('#js-app').removeChild(document.querySelector('.parsha-picker'))\n  }\n}\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  _src__WEBPACK_IMPORTED_MODULE_0__[\"InfiniteScroller\"]\n    .new({\n      container: document.querySelector('[data-target-id=\"tikkun-book\"]'),\n      fetchPreviousContent: {\n        fetch: () => fetchPage(iterator.previous()),\n        render: (container, { key, content }) => {\n          const node = document.createElement('div')\n          insertBefore(container, node)\n          cache[key] = { node, content }\n\n          setState({ cache })\n        }\n      },\n      fetchNextContent: {\n        fetch: () => fetchPage(iterator.next()),\n        render: (container, { key, content }) => {\n          const node = document.createElement('div')\n          insertAfter(container, node)\n          cache[key] = { node, content }\n\n          setState({ cache })\n        }\n      }\n    })\n    .attach()\n\n  document.querySelector('[data-target-id=\"annotations-toggle\"]').addEventListener('change', (e) => {\n    const showAnnotations = e.target.checked\n\n    setState({ showAnnotations })\n  })\n\n  document.querySelector('[data-target-id=\"parsha-title\"]').addEventListener('click', toggleParshaPicker)\n\n  fetchPage(iterator.next())\n    .then(({ key, content }) => {\n      const node = document.createElement('div')\n      cache[key] = { node, content }\n      insertAfter(document.querySelector('[data-target-id=\"tikkun-book\"]'), node)\n\n      setState({ cache, showAnnotations: document.querySelector('[data-target-id=\"annotations-toggle\"]').checked })\n    })\n})\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/display-range.js":
/*!******************************!*\
  !*** ./src/display-range.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const hebrewNumeralFromInteger = __webpack_require__(/*! ./hebrew-numeral */ \"./src/hebrew-numeral.js\")\n\nvar asRange = (strings) => {\n  if (!strings.length) {\n    return ''\n  }\n\n  if (strings.length === 1) {\n    return strings[0]\n  }\n\n  return [strings[0], strings[strings.length - 1]].join('-')\n}\n\nconst aliyotStrings = [\n  'ראשון',\n  'שני',\n  'שלישי',\n  'רביעי',\n  'חמישי',\n  'ששי',\n  'שביעי',\n  'מפטיר'\n]\n\nvar aliyotNames = (aliyot) => aliyot\n  .filter((aliyah) => aliyah > 0 && aliyah <= aliyotStrings.length)\n  .map((aliyah) => aliyotStrings[aliyah - 1])\n\nconst asVersesRange = (verses) => asRange(verses.map((verse) => {\n  const components = []\n\n  if (verse.verse === 1) {\n    components.push(verse.chapter)\n  }\n\n  components.push(verse.verse)\n\n  return components\n    .map((num) => hebrewNumeralFromInteger(num))\n    .join(':')\n}))\n\nconst asAliyotRange = (aliyot) => {\n  if (!aliyot.length) {\n    return ''\n  }\n\n  const aliyotByName = aliyotNames(aliyot)\n\n  return aliyotByName[0] + (aliyotByName[1] ? ` [${aliyotByName[1]}]` : '')\n}\n\nmodule.exports = { asVersesRange, asAliyotRange }\n\n\n//# sourceURL=webpack:///./src/display-range.js?");

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
/*! exports provided: textFilter, hebrewNumeralFromInteger, displayRange, InfiniteScroller, IntegerIterator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"textFilter\", function() { return textFilter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hebrewNumeralFromInteger\", function() { return hebrewNumeralFromInteger; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"displayRange\", function() { return displayRange; });\n/* harmony import */ var _infinite_scroller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./infinite-scroller */ \"./src/infinite-scroller.js\");\n/* harmony import */ var _infinite_scroller__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_infinite_scroller__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, \"InfiniteScroller\", function() { return _infinite_scroller__WEBPACK_IMPORTED_MODULE_0___default.a; });\n/* harmony import */ var _integer_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./integer-iterator */ \"./src/integer-iterator.js\");\n/* harmony import */ var _integer_iterator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_integer_iterator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, \"IntegerIterator\", function() { return _integer_iterator__WEBPACK_IMPORTED_MODULE_1___default.a; });\n\n\nconst hebrewNumeralFromInteger = __webpack_require__(/*! ./hebrew-numeral */ \"./src/hebrew-numeral.js\")\nconst textFilter = __webpack_require__(/*! ./text-filter */ \"./src/text-filter.js\")\nconst displayRange = __webpack_require__(/*! ./display-range */ \"./src/display-range.js\")\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/infinite-scroller.js":
/*!**********************************!*\
  !*** ./src/infinite-scroller.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let alreadyInFlight = false\nconst oneAtATime = (promise) => {\n  if (alreadyInFlight) return Promise.resolve()\n  alreadyInFlight = true\n  return promise()\n    .then((val) => {\n      alreadyInFlight = false\n      return val\n    })\n}\n\nconst InfiniteScroller = {\n  new: ({ container, fetchPreviousContent, fetchNextContent }) => ({\n    attach: () => container.addEventListener('scroll', (e) => {\n      const scrollView = e.target\n\n      const hiddenAboveHeight = scrollView.scrollTop\n      const height = scrollView.clientHeight\n\n      const hiddenBelowHeight = scrollView.scrollHeight - (scrollView.clientHeight + scrollView.scrollTop)\n\n      if (hiddenAboveHeight < 0.5 * height) {\n        oneAtATime(() => fetchPreviousContent.fetch())\n          .then(({ key, content }) => {\n            if (!content) return\n\n            const belowHeight = scrollView.scrollHeight - scrollView.scrollTop\n\n            fetchPreviousContent.render(container, { key, content })\n\n            scrollView.scrollTop = scrollView.scrollHeight - belowHeight\n          })\n      } else if (hiddenBelowHeight < 0.5 * height) {\n        oneAtATime(() => fetchNextContent.fetch())\n          .then(({ key, content } = {}) => {\n            if (content) fetchNextContent.render(container, { key, content })\n          })\n      }\n    })\n  })\n}\n\nmodule.exports = InfiniteScroller\n\n\n//# sourceURL=webpack:///./src/infinite-scroller.js?");

/***/ }),

/***/ "./src/integer-iterator.js":
/*!*********************************!*\
  !*** ./src/integer-iterator.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  new: ({ startingAt }) => {\n    let previousCount = 0\n    let nextCount = 0\n\n    return {\n      previous: () => {\n        previousCount += 1\n        return startingAt - previousCount\n      },\n      next: () => {\n        nextCount += 1\n        return startingAt + nextCount - 1\n      }\n    }\n  }\n}\n\n\n//# sourceURL=webpack:///./src/integer-iterator.js?");

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