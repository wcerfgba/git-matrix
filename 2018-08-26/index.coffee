{ Transform } = require 'stream'
{ readFile } = require 'fs'
{ spawn } = require 'child_process'
{ compact, last, isEmpty, trim } = require 'lodash'
{ inspect } = require 'util'


debug = (...xs) => console.debug inspect xs, { depth: null }



matchCommit = (str) =>
  matches = str.match(/^(\d+) (.*@.*)$/)
  return null if !matches
  {
    time: Number matches[1]
    email: matches[2]
  }



class ChangesObjectStream extends Transform
  constructor: () ->
    super({ objectMode: true })
    @lastCommit = null

  _transform: (chunk) ->
    chunk = chunk.toString 'utf8'
    commits = compact chunk.split '\n\n\n'
      .map trim
    commitObjects = commits.reduce (objects, commit) =>
      lines = compact commit.split '\n'
      object = matchCommit lines[0]
      if object
        newObject = true
        lines.shift()
      else
        object = @lastCommit
        newObject = false
      object.files = [
        ...(object.files || [])
        ...(compact lines)
      ]
      if newObject || isEmpty objects
        objects.push object
        @lastCommit = object
      objects
    , []
    @push commitObjects




main = () =>
  changesProc = spawn 'git', ['--no-pager', 'log', '--format=%n%n%ct %ae', '--name-only', '--no-merges']
  changesProc.on 'exit', (code) => debug code
  changesRawStream = changesProc.stdout
  changesObjectStream = new ChangesObjectStream
  changesRawStream.pipe changesObjectStream

  changesObjectStream.on 'data', (changes) =>
    debug changes
  
  await changesObjectStream.finished

main()