# @flow

CommitMatrix = require './CommitMatrix'

CommitCountMatrix = () =>
  new CommitMatrix ({ commitFile, fileScore }) =>
    fileScore.score + 1

module.exports = CommitCountMatrix