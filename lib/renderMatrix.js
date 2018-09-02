// @flow
var CELL_HEIGHT_REMS, bodyMaxWidthRems, columnWidthPercentage, elMap, fileRows, floor, header, layout, matrixToHtml, numCols, range, scoreCellStyle, stylesheet, table, tableHeading;

({range, floor} = require('./util'));

elMap = (xs) => {
  return (f) => {
    return (xs.map(f)).join('');
  };
};

matrixToHtml = (matrix/*: CommitMatrix */)/*: string */ => {
  return layout({
    style: stylesheet(matrix)
  })(...[header(matrix), table(matrix)]);
};

CELL_HEIGHT_REMS = 3;

stylesheet = (matrix) => {
  return `body {\n  max-width: ${bodyMaxWidthRems(matrix)};\n  margin: 0 auto;\n  background: hsl(240, 50%, 10%);\n  color: hsl(0, 0%, 95%);\n}\n\ntable {\n  table-layout: fixed;\n  width: 100%;\n}\n\ncol {\n  width: ${columnWidthPercentage(matrix)};\n}\n\nth, td {\n  font-weight: normal;\n  font-size: 1rem;\n  padding: 0.25rem;\n  height: ${CELL_HEIGHT_REMS}rem;\n}\n\nth {\n  text-align: left;\n  font-family: monospace;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\ntd {\n  text-align: center;\n  font-family: sans-serif;\n}`;
};

bodyMaxWidthRems = (matrix) => {
  return `${numCols(matrix) * CELL_HEIGHT_REMS * 3}rem`;
};

columnWidthPercentage = (matrix) => {
  var percentage, ratio;
  ratio = 1 / numCols(matrix);
  percentage = floor(ratio * 100);
  return `${percentage}%`;
};

numCols = (matrix) => {
  return matrix.emails.length + 1;
};

layout = ({style}) => {
  return (...bodyContent) => {
    return `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <style>\n      ${style}\n    </style>\n  </head>\n  <body>\n    ${bodyContent.join('\n')}\n  </body>\n</html>`;
  };
};

header = (matrix) => {
  return "  ";
};

table = (matrix) => {
  return `<table>\n  <colgroup>\n    ${range(numCols(matrix)).map(() => {
    return "<col>";
  }).join('\n')}\n  </colgroup>\n  <tbody>\n    <tr>\n      <td></td>\n      ${tableHeading({
    scope: 'col'
  })(...matrix.emails)}\n    </tr>\n    ${fileRows(matrix)}\n  </tbody>\n</table>`;
};

tableHeading = ({scope}) => {
  return (...headings) => {
    return headings.map((heading) => {
      return `<th scope='${scope}'>${heading}</th>`;
    }).join('\n');
  };
};

fileRows = (matrix) => {
  return matrix.files.map((file, fileIndex) => {
    return `<tr>\n  ${tableHeading({
      scope: 'row'
    })(file.name)}\n  ${matrix.matrix.map((committer) => {
      var cellScore, totalScore;
      cellScore = committer.fileScores[fileIndex].score;
      totalScore = file.totalScore;
      return `<td style='${scoreCellStyle({cellScore, totalScore})}'>${cellScore}</td>`;
    }).join('\n')}\n</tr>`;
  }).join('\n');
};

scoreCellStyle = ({cellScore, totalScore}) => {
  var scoreHue;
  scoreHue = floor((cellScore / totalScore) * 120);
  return [`background: hsl(${scoreHue}, 100%, 40%);`].join('');
};

module.exports = {matrixToHtml};

//# sourceMappingURL=renderMatrix.js.map
