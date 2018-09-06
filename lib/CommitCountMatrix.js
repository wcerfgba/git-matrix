// @flow
var CommitCountMatrix, CommitMatrix;

CommitMatrix = require('./CommitMatrix');

CommitCountMatrix = () => {
  return new CommitMatrix(({commitFile, fileScore}) => {
    return 1;
  });
};

module.exports = CommitCountMatrix;
