# @flow

elMap = (xs) => (f) => (xs.map f).join '\n'

matrixToHtml = (matrix ###: UserFileChangeCountMatrix ###) ###: string ### =>
  emails = elMap matrix.emails
  emailHeadings = emails (email) => "<th scope='col'>#{email}</th>"
  users = elMap matrix.matrix
  fileRows = users (user) =>
    files = elMap user[1]
    files (file, i) =>
      fileCols = users (user) => "<td>#{user[1][i][1]}</td>"
      """
      <tr>
        <th scope='row'>#{file[0]}</th>
        #{fileCols}
      </tr>
      """
  """
  <table>
    <tr>
      <td></td>
      #{emailHeadings}
    </tr>
    #{fileRows}
  </table>

  """

module.exports = {
  matrixToHtml
}