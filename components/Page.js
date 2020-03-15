import Line from './Line'

const Page = (lines) => `
  <table>
    ${lines.map((line) => (`
      <tr>
        <td>${Line(line)}</td>
      </tr>
    `)).join('')}
  </table>
`

export default Page
