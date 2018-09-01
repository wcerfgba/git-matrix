# @flow

CommitMatrix = require './CommitMatrix'

ChangeCountMatrix = () =>
  new CommitMatrix ({ commitFile, fileScore }) =>
    fileScore.score + commitFile.linesAdded + commitFile.linesDeleted

module.exports = ChangeCountMatrix