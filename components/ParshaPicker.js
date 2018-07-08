import parshiyot from '../build/parshiyot.json'

const ParshaPicker = () => `
  <div class="parsha-picker">
    <ol class="parsha-list">
      ${parshiyot.map(({ he, page }) => (`<li class="parsha" data-target-id="parsha" data-jump-to-page="${page}">${he}</li>`)).join('')}
    </ol>
  </div>
`

export default ParshaPicker
