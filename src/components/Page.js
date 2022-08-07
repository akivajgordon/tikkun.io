import Line from './Line'

const Page = ({ scroll: _scroll, lines }) => `
  <table>
    ${lines.map(line => Line({ scroll: _scroll, ...line })).join('')}
  </table>
`

export default Page
