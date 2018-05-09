import {html, render} from './node_modules/lit-html/lit-html.js'

render(html`<link rel="import" href="/tikkun-app/tikkun-app.html">`, document.getElementById('js-app'))

const hebrewNumeralFromInteger = require('./src/hebrew-numeral')
const textFilter = require('./src/text-filter')

window.TikkunApp = window.TikkunApp || {textFilter, hebrewNumeralFromInteger}
