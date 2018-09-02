# @flow

{ range, floor } = require './util'

elMap = (xs) => (f) => (xs.map f).join ''

matrixToHtml = (matrix ###: CommitMatrix ###) ###: string ### =>
  layout({ style: stylesheet matrix }) ...[
    header matrix
    table matrix
  ]

CELL_HEIGHT_REMS = 3

stylesheet = (matrix) =>
  """
  body {
    max-width: #{bodyMaxWidthRems matrix};
    margin: 0 auto;
    background: hsl(240, 50%, 10%);
    color: hsl(0, 0%, 95%);
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
    height: #{CELL_HEIGHT_REMS}rem;
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

bodyMaxWidthRems = (matrix) =>
  "#{numCols(matrix) * CELL_HEIGHT_REMS * 3}rem"

columnWidthPercentage = (matrix) =>
  ratio = 1 / numCols(matrix)
  percentage = floor (ratio * 100)
  "#{percentage}%"

numCols = (matrix) => matrix.emails.length + 1

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
        range(numCols matrix)
          .map () => "<col>"
          .join '\n'
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
    .map (heading) => "<th scope='#{scope}' title='#{heading}'>#{heading}</th>"
    .join '\n'

fileRows = (matrix) =>
  matrix.files
    .map (file, fileIndex) =>
      """
      <tr>
        #{tableHeading({ scope: 'row' }) file.name}
        #{
          matrix.matrix
            .map (committer) =>
              cellScore = committer.fileScores[fileIndex].score
              totalScore = file.totalScore
              "<td style='#{scoreCellStyle { cellScore, totalScore }}'>#{cellScore}</td>"
            .join '\n'
        }
      </tr>
      """
    .join '\n'

scoreCellStyle = ({ cellScore, totalScore }) =>
  scoreHue = floor ((cellScore / totalScore) * 120)
  [
    "background: hsl(#{scoreHue}, 100%, 40%);"
  ].join ''

module.exports = {
  matrixToHtml
}