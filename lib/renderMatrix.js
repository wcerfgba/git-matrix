// @flow
var columnWidthPercentage, elMap, fileRows, floor, header, layout, matrixToHtml, range, stylesheet, table, tableHeading;

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

stylesheet = (matrix) => {
  return `body {\n  margin: 0;\n}\n\ntable {\n  table-layout: fixed;\n  width: 100%;\n}\n\ncol {\n  width: ${columnWidthPercentage(matrix)};\n}\n\nth, td {\n  font-weight: normal;\n  font-size: 1rem;\n  padding: 0.25rem;\n  height: 3rem;\n}\n\nth {\n  text-align: left;\n  font-family: monospace;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\ntd {\n  text-align: center;\n  font-family: sans-serif;\n}`;
};

columnWidthPercentage = (matrix) => {
  var numCols, percentage, ratio;
  numCols = matrix.emails.count + 1;
  ratio = 1 / numCols;
  percentage = floor(ratio * 100);
  return `${percentage}%`;
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
  return `<table>\n  <colgroup>\n    ${range(matrix.emails.count + 1).map(() => {
    return "<col></col>";
  })}\n  </colgroup>\n  <tbody>\n    <tr>\n      <td></td>\n      ${tableHeading({
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
  return matrix.files.map((fileName, fileIndex) => {
    return `<tr>\n  ${tableHeading({
      scope: 'row'
    })(fileName)}\n  ${matrix.matrix.map((committer) => {
      return `<td>${committer.fileScores[fileIndex].score}</td>`;
    }).join('\n')}\n</tr>`;
  }).join('\n');
};

module.exports = {matrixToHtml};

//# sourceMappingURL=renderMatrix.js.map
