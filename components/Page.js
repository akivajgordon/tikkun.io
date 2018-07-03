import Line from './Line'

const Page = (lines, annotated) => `
  <table>
    ${lines.map((line) => (`
      <tr>
        <td>${Line(line, annotated)}</td>
      </tr>
    `)).join('')}
  </table>
`

export default Page
