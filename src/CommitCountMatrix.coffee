# @flow

CommitMatrix = require './CommitMatrix'

CommitCountMatrix = () =>
  new CommitMatrix ({ commitFile, fileScore }) =>
    1

module.exports = CommitCountMatrix