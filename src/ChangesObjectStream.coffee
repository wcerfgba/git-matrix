# @flow

{ Transform } = require 'stream'
{ compact, trim, sumBy, debug } = require './util'

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


HEADER_REGEXP = /^(\d+) (.*@.*)$/
FILE_REGEXP = /^(\d+|-)\t(\d+|-)\t(.*)$/

matchRawCommit = (text) =>
  lines = text.split '\n'
  # console.log lines
  # First two lines are empty.
  return false if lines.shift() != ''
  return false if lines.shift() != ''
  header = lines.shift().match HEADER_REGEXP
  return false if !header
  # Next line is empty.
  return false if lines.shift() != ''
  # Last file line should terminate with a newline, leaving an empty string
  # at the end of the array, so find the first empty string in the array
  # and terminate the commit there.
  lastLine = lines.indexOf ''
  return false if lastLine == -1
  files = lines.slice 0, lastLine
  try
    files = files.map (file) =>
      file = file.match FILE_REGEXP
      throw new FileLineDoesNotMatchError if !file
      {
        linesAdded: parseChangeCount file[1]
        linesDeleted: parseChangeCount file[2]
        name: file[3]
      }
  catch FileLineDoesNotMatchError
    return false
  commit = {
    time: Number header[1]
    email: header[2]
    files
  }
  length = sumBy [
    '\n\n'
    header[0], '\n'
    '\n'
    lines.slice(0, lastLine).join '\n'
    '\n'
  ], (string) => string.length
  { commit, length }

class FileLineDoesNotMatchError < Error

class ChangesObjectStream extends Transform
  ###::
  lastCommit: ?Commit
  ###

  constructor: () ->
    super({ readableObjectMode: true })
    @buffer = ''
    @totalBytesRead = 0

  _transform: (chunk ###: Buffer ###, encoding, callback) ###: void ### ->
    @totalBytesRead += chunk.length
    # console.log 'inside:', @totalBytesRead
    @buffer += chunk.toString()
    # console.log @buffer
    while matchedCommit = matchRawCommit @buffer
      { commit, length } = matchedCommit
      # console.log 'length:', length
      # console.log matchedCommit
      @buffer = @buffer.slice length
      # console.log '\n---BEGIN---\n', @buffer, '\n---END---\n'
      @push commit
      newData = true
      # debug @buffer
    callback() if newData


module.exports = ChangesObjectStream