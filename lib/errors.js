var GitMatrixError, UnknownMatrixError;

GitMatrixError = class GitMatrixError extends Error {
  constructor(message) {
    super(message);
  }

};

UnknownMatrixError = function(matrix) {
  return new GitMatrixError(`Unknown matrix: ${matrix}`);
};

module.exports = {GitMatrixError, UnknownMatrixError};
