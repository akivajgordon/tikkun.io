import Line from './Line'

const Page = ({ scroll: _scroll, lines }) => `
  <table>
    ${lines.map((line) => (`
      <tr>
        <td>${Line({ scroll: _scroll, ...line })}</td>
      </tr>
    `)).join('')}
  </table>
`

export default Page
