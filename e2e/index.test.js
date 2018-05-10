import test from 'ava'
const { Builder, By, until } = require('selenium-webdriver')
const page1Text = require('./data/page1Text')
const page1TextUnannotated = require('./data/page1Text.unannotated')
const page22Text = require('./data/page22Text')
const page23Text = require('./data/page23Text')
const page24Text = require('./data/page24Text')

let driver
test.before(() => {
  driver = new Builder()
    .forBrowser('safari')
    .build()
})

test.after.always(() => {
  return driver.quit()
})

test.beforeEach(t => {
  t.context = {
    app: {
      launch: () => driver.get('http://localhost:8000'),
      currentTextContent: () => driver.wait(until.elementsLocated(By.css('.tikkun-line.column')), 2000)
        .then((elements) => Promise.all(elements.map((el) => el.getText())))
        .then((lines) => lines.map((line) => line.trim().replace(/\s+/g, ' ')))
        .then((lines) => lines.map((line) => [line])),
      currentTitle: () => driver.wait(until.elementLocated(By.css('.navigation-title')), 2000)
        .then((el) => el.getText())
        .then((title) => title.trim()),
      jumpToParsha: (parsha) => driver.wait(until.elementsLocated(By.css('.parshiyot-parsha')), 2000)
        .then((elements) => Promise.all(elements.map((el) => el.getText().then((text) => ({el, text})))))
        .then((elements) => elements.find(({text}) => text === parsha))
        .then(({el}) => el.click()),
      clickNextPage: () => driver.findElement(By.css('#next-button'))
        .then((el) => el.click()),
      clickPreviousPage: () => driver.findElement(By.css('#prev-button'))
        .then((el) => el.click()),
      toggleAnnotations: () => driver.findElement(By.css('.js-annotations-toggle'))
        .then((el) => el.click())
    }
  }
})

test('the displayed text on launch is the text of the first page', t => {
  const { app } = t.context
  return app.launch()
    .then(() => app.currentTextContent())
    .then((textContent) => t.deepEqual(textContent, page1Text))
})

test('the displayed title on launch is the first parsha', t => {
  const { app } = t.context
  return app.launch()
    .then(() => app.currentTitle())
    .then((title) => t.is(title, 'בראשית'))
})

test('clicking on a parsha from the list should display that parsha in the title', t => {
  const { app } = t.context

  return app.launch()
    .then(() => app.jumpToParsha('נח'))
    .then(() => app.currentTitle())
    .then((title) => {
      t.is(title, 'בראשית – נח')
    })
})

test('clicking on a parsha from the list should display that parsha\'s first page', t => {
  const { app } = t.context

  return app.launch()
    .then(() => app.jumpToParsha('חיי שרה'))
    .then(() => app.currentTextContent())
    .then((textContent) => t.deepEqual(textContent, page23Text))
})

test('clicking on a next page should show next page after this one', t => {
  const { app } = t.context

  return app.launch()
    .then(() => app.jumpToParsha('חיי שרה'))
    .then(() => app.clickNextPage())
    .then(() => driver.sleep(100))
    .then(() => app.currentTextContent())
    .then((textContent) => t.deepEqual(textContent, page24Text))
})

test('clicking on a previous page should show previous page before this one', t => {
  const { app } = t.context

  return app.launch()
    .then(() => app.jumpToParsha('חיי שרה'))
    .then(() => app.clickPreviousPage())
    .then(() => driver.sleep(100))
    .then(() => app.currentTextContent())
    .then((textContent) => t.deepEqual(textContent, page22Text))
})

test('changing annotation toggle from on to off should hide annotations', t => {
  const { app } = t.context

  return app.launch()
    .then(() => app.jumpToParsha('בראשית'))
    .then(() => app.toggleAnnotations())
    .then(() => app.currentTextContent())
    .then((textContent) => t.deepEqual(textContent, page1TextUnannotated))
})
