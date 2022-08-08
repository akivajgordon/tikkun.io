import Line from './Line'

const Page = ({ scroll: _scroll, lines }) => `
  <table>
    ${lines
      .map((line, idx) => Line({ scroll: _scroll, lineIndex: idx, ...line }))
      .join('')}
  </table>
`

export default Page
