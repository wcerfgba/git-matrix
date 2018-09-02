# @flow

{ Transform } = require 'stream'
{ compact, trim } = require './util'

matchCommitHeader = (str) ###: ?Commit ### =>
  matches = str.match(/^(\d+) (.*@.*)$/)
  return null if !matches
  {
    time: Number matches[1]
    email: matches[2]
    files: []
  }

parseChangeCount = (count) =>
  return 1 if count == '-'
  Number count

parseCommitChanges = (lines) =>
  lines.map (line) =>
    parts = line.split '\t'
    {
      linesAdded: parseChangeCount parts[0]
      linesDeleted: parseChangeCount parts[1]
      name: parts[2]
    }

class ChangesObjectStream extends Transform
  ###::
  lastCommit: ?Commit
  ###

  constructor: () ->
    super({ objectMode: true })
    @lastCommit = null

  _transform: (chunk ###: Buffer | string ###) ###: void ### ->
    chunk = chunk.toString()
    rawCommits = chunk.split '\n\n\n'
    rawCommits = compact rawCommits
    rawCommits = rawCommits.map trim
    commitObjects = rawCommits.reduce (commits, raw) =>
      lines = compact raw.split '\n'
      commit = matchCommitHeader lines[0]
      if commit
        commit.files = parseCommitChanges lines.slice 1
        @lastCommit = commit
        return [
          ...commits,
          commit
        ]
      commit = @lastCommit
      throw new Error 'Stream must begin at start of a commit' if commit == null
      changedFiles = parseCommitChanges lines
      changedFiles.forEach (changedFile) =>
        existingFile = commit.files.find (file) => file.name == changedFile.name
        if existingFile
          existingFile.linesAdded += changedFile.linesAdded
          existingFile.linesDeleted += changedFile.linesDeleted
        else
          commit.files.push changedFile
      commits
    , []
    commitObjects.forEach (commit) => @push commit


module.exports = ChangesObjectStream