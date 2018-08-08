import parshiyot from '../build/parshiyot.json'

const ParshaPicker = () => `
  <div class="parsha-picker">
    <ol class="parsha-list">
      ${parshiyot.map(({ he, ref }) => (`<li
        class="parsha"
        data-target-id="parsha"
        data-jump-to-book="${ref.b}"
        data-jump-to-chapter="${ref.c}"
        data-jump-to-verse="${ref.v}"
      >${he}</li>`)).join('')}
    </ol>
  </div>
`

export default ParshaPicker
