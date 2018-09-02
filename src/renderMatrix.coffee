# @flow

{ range, floor } = require './util'

elMap = (xs) => (f) => (xs.map f).join ''

matrixToHtml = (matrix ###: CommitMatrix ###) ###: string ### =>
  layout({ style: stylesheet matrix }) ...[
    header matrix
    table matrix
  ]

stylesheet = (matrix) =>
  """
  body {
    margin: 0;
  }

  table {
    table-layout: fixed;
    width: 100%;
  }

  col {
    width: #{columnWidthPercentage matrix};
  }

  th, td {
    font-weight: normal;
    font-size: 1rem;
    padding: 0.25rem;
    height: 3rem;
  }

  th {
    text-align: left;
    font-family: monospace;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  td {
    text-align: center;
    font-family: sans-serif;
  }
  """

columnWidthPercentage = (matrix) =>
  numCols = matrix.emails.count + 1
  ratio = 1 / numCols
  percentage = floor (ratio * 100)
  "#{percentage}%"

layout = ({ style }) => (...bodyContent) =>
  """
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        #{style}
      </style>
    </head>
    <body>
      #{bodyContent.join '\n'}
    </body>
  </html>
  """

header = (matrix) =>
  """
  """

table = (matrix) =>
  """
  <table>
    <colgroup>
      #{
        range(matrix.emails.count + 1).map () =>
          "<col></col>"
      }
    </colgroup>
    <tbody>
      <tr>
        <td></td>
        #{tableHeading({ scope: 'col' }) ...matrix.emails}
      </tr>
      #{fileRows matrix}
    </tbody>
  </table>
  """

tableHeading = ({ scope }) => (...headings) =>
  headings
    .map (heading) => "<th scope='#{scope}'>#{heading}</th>"
    .join '\n'

fileRows = (matrix) =>
  console.log matrix.files
  matrix.files
    .map (file, fileIndex) =>
      """
      <tr>
        #{tableHeading({ scope: 'row' }) file.name}
        #{
          matrix.matrix
            .map (committer) => "<td>#{committer.fileScores[fileIndex].score}</td>"
            .join '\n'
        }
      </tr>
      """
    .join '\n'

module.exports = {
  matrixToHtml
}