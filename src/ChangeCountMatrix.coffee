# @flow

CommitMatrix = require './CommitMatrix'

ChangeCountMatrix = () =>
  new CommitMatrix ({ commitFile, fileScore }) =>
    commitFile.linesAdded + commitFile.linesDeleted

module.exports = ChangeCountMatrix