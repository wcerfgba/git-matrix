# @flow

{ Transform } = require 'stream'
{ compact, trim, sumBy, debug } = require './util'

parseChangeCount = (count) =>
  return 1 if count == '-'
  Number count

WRAPPER_REGEXP = /\n\n([\s\S]*?)\n\n\n/
HEADER_REGEXP = /^(\d+) (.*)$/
FILE_REGEXP = /^(\d+|-)\t(\d+|-)\t(.*)$/

matchRawCommit = (text) =>
  try
    # console.log 'qwe' if text.startsWith '\n\n1473640846'
    # Commit should be wrapped in two newlines.
    text = text.match WRAPPER_REGEXP
    return false if !text
    text = text[1]
    # console.log text
    lines = text.split '\n'
    # console.log lines
    header = (shift lines).match HEADER_REGEXP
    return false if !header
    # Next line is empty, or would be if the commit had files.
    noFiles = true if lines.length == 0
    return false if (shift lines) != '' unless noFiles
    # # Last file line should terminate with a newline, leaving an empty string
    # # at the end of the array, so find the first empty string in the array
    # # and terminate the commit there.
    # lastLine = lines.indexOf ''
    # return false if lastLine == -1
    # # After lastLine, we expect the final second newline which marks the end
    # # of the numstats, and the end of the commit.
    # return false if lines.length <= lastLine || lines[lastLine + 1] != ''
    # files = lines.slice 0, lastLine
    files = lines.map (line) =>
      file = line.match FILE_REGEXP
      throw new FileLineDoesNotMatchError if !file
      {
        linesAdded: parseChangeCount file[1]
        linesDeleted: parseChangeCount file[2]
        name: file[3]
      }
    commit = {
      time: Number header[1]
      email: header[2]
      files
    }
    length = sumBy [
      '\n'
      '\n'
      header[0], '\n'
      if noFiles then '' else '\n'
      lines.join '\n', '\n'
      if noFiles then '' else '\n'
      # Don't take off the last two newlines, because they wrap the start of 
      # the next commit.
    ], (string) => string.length
    { commit, length }
  catch e
    if e instanceof FileLineDoesNotMatchError ||
      e instanceof MissingLineError
        return false
    throw e

class FileLineDoesNotMatchError < Error
class MissingLineError < Error

shift = (xs) =>
  throw new MissingLineError if !xs || xs.length == 0
  xs.shift()

class ChangesObjectStream extends Transform
  ###::
  lastCommit: ?Commit
  ###

  constructor: () ->
    super({ readableObjectMode: true })
    @buffer = ''
    @totalBytesRead = 0
    @totalCommitsMatched = 0
    @chunksSinceLastCommit = 0

  _transform: (chunk ###: Buffer ###, encoding, callback) ###: void ### ->
    @totalBytesRead += chunk.length
    # console.log 'inside:', @totalBytesRead
    @buffer += chunk.toString()
    @processBuffer callback

  processBuffer: (callback) =>
    # console.log '@buffer.length', @buffer.length
    commitsMatched = 0
    while matchedCommit = matchRawCommit @buffer
      { commit, length } = matchedCommit
      # console.log 'length:', length
      # console.log matchedCommit
      @buffer = @buffer.slice length
      # console.log '\n---BEGIN---\n', @buffer, '\n---END---\n'
      @push commit
      newData = true
      commitsMatched += 1
      # debug @buffer
    @totalCommitsMatched += commitsMatched
    @assertChunksSinceLastCommit commitsMatched
    # console.log 'commitsMatched', commitsMatched
    callback() if newData

  _flush: (callback) ->
    # Force a final commit to be flushed by ensuring we can match the end of
    # a list of numstat lines.
    @buffer += '\n\n'
    @processBuffer callback

    
  assertChunksSinceLastCommit: (commitsMatched ###: number ###) =>
    @chunksSinceLastCommit = 0 if commitsMatched > 0
    @chunksSinceLastCommit += 1 unless commitsMatched > 0
    throw new TooManyChunksSinceLastCommitError this if @chunksSinceLastCommit >= 1

module.exports = ChangesObjectStream

class TooManyChunksSinceLastCommitError extends Error
  constructor: (changesObjectStream) ->
    super()
    @bufferHead = changesObjectStream.buffer.slice 0, 1024
    @message = """
      Too many chunks since last commit. Buffer head:
      ```
      #{@bufferHead}
      ```
    """
