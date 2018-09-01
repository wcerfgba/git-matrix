# @flow

elMap = (xs) => (f) => (xs.map f).join ''

matrixToHtml = (matrix ###: CommitMatrix ###) ###: string ### =>
  emails = elMap matrix.emails
  emailHeadings = emails (email) => "<th scope='col'>#{email}</th>"
  committers = elMap matrix.matrix
  fileRows = committers (committer) =>
    fileScores = elMap committer.fileScores
    fileScores (fileScore, i) =>
      fileCols = committers (committer) => "<td>#{committer.fileScores[i].score}</td>"
      "<tr><th scope='row'>#{fileScore.fileName}</th>#{fileCols}</tr>"
  "<table><tr><td></td>#{emailHeadings}</tr>#{fileRows}</table>"

module.exports = {
  matrixToHtml
}