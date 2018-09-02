// @flow
var ChangeCountMatrix, CommitMatrix;

CommitMatrix = require('./CommitMatrix');

ChangeCountMatrix = () => {
  return new CommitMatrix(({commitFile, fileScore}) => {
    return commitFile.linesAdded + commitFile.linesDeleted;
  });
};

module.exports = ChangeCountMatrix;

//# sourceMappingURL=ChangeCountMatrix.js.map
