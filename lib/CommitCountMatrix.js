// @flow
var CommitCountMatrix, CommitMatrix;

CommitMatrix = require('./CommitMatrix');

CommitCountMatrix = () => {
  return new CommitMatrix(({commitFile, fileScore}) => {
    return fileScore.score + 1;
  });
};

module.exports = CommitCountMatrix;

//# sourceMappingURL=CommitCountMatrix.js.map
