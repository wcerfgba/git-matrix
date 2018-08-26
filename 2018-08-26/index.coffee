{ Transform, finished, pipeline } = require 'stream'
{ readFile, readFileSync } = require 'fs'
{ spawn } = require 'child_process'
{ compact, last, flatten, difference, isEmpty, trim, union } = require 'lodash'
{ inspect, promisify } = require 'util'


finishedAsync = promisify finished


debug = (...xs) => console.debug inspect xs, { depth: null }



matchCommit = (str) =>
  matches = str.match(/^(\d+) (.*@.*)$/)
  return null if !matches
  {
    time: Number matches[1]
    email: matches[2]
  }



# Produces commit objects of the form
# ```
# {
#   email:
#   time:
#   files: []
# }
#```
class ChangesObjectStream extends Transform
  constructor: () ->
    super({ objectMode: true })
    @lastCommit = null

  _transform: (chunk) =>
    chunk = chunk.toString 'utf8'
    # debug chunk
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


parseChanges = (raw) =>
  commits = compact raw.split '\n\n\n'
    .map trim
  commitObjects = commits.reduce (objects, commit) =>
    lines = compact commit.split '\n'
    object = matchCommit lines.shift()
    object.files = [
      ...(object.files || [])
      ...(compact lines)
    ]
    objects.push object
    objects
  , []
  commitObjects


class UserFileCommitCountMatrix
  constructor: () ->
    # The matrix is a table with users along one axis and files along the other
    # axis, and the number of commits a user has for a file as the cell. We 
    # store the matrix internally as a 2-dimensional array of size 
    # `<num users> x <num files>`, and where each entry is a key-value pair.
    # The user entry is outermost and the file entry is innermost. The user 
    # entry is of the form `[ <email>, [ <file entry> ] ]`, and the 
    # file entry is of the form `[ <filename>, <user file commit count> ]`.
    # ```
    # [
    #   [ 'user1', [
    #     [ 'file1', 0 ],
    #     [ 'file2', 3 ]
    #     [ 'file3', 0]
    #   ]],
    #   [ 'user2', [
    #     [ 'file1', 12 ],
    #     [ 'file2',  0 ],
    #     [ 'file3',  3 ]
    #   ]],
    # ]
    # ```
    @matrix = []
    @files = []
    @emails = []
  
  addCommit: (commit) =>
    @emails = union @emails, [commit.email]
    @files = union @files, commit.files
    @reshapeMatrix()
    user = @matrix.find (u) => u[0] == commit.email
    files = user[1]
    files.forEach (file) =>
      file[1] += 1 if commit.files.includes file[0]
      # debug file

  reshapeMatrix: () =>
    currentEmails = @matrix.map (user) => user[0]
    newEmails = difference @emails, currentEmails
    newEmails.forEach (email) => 
      @matrix.push [ email, [] ]
    @matrix.forEach (user) =>
      files = user[1]
      currentFiles = files.map (file) => file[0]
      newFiles = difference @files, currentFiles
      newFiles.forEach (file) =>
        files.push [ file, 0 ]




main = () =>
  # changesProc = spawn 'git', ['--no-pager', 'log', '--format=%n%n%ct %ae', '--name-only', '--no-merges']
  # changesRawStream = changesProc.stdout
  changesRaw = readFileSync 'changes'
  changesRaw = changesRaw.toString 'utf8'
  matrix = new UserFileCommitCountMatrix
  # changesRawStream.on 'data', (chunk) => changesRaw += chunk.toString('utf8')
  # changesProc.on 'close', () =>
  changes = parseChanges changesRaw
  changes.forEach matrix.addCommit
  debug ...matrix.matrix


  # await finishedAsync changesRawStream
  # changesObjectStream = new ChangesObjectStream
  # matrix = new UserFileCommitCountMatrix
  # changesObjectStream.on 'data', (changes) =>
  #   changes = flatten changes
  #   # return if !changes
  #   changes.forEach matrix.addCommit
  #   # debug matrix

  # changesRawStream.on 'data', (chunk) => changesObjectStream.write(chunk)

  # await pipeline changesRawStream, changesObjectStream
  
  # await finishedAsync changesRawStream

  # debug matrix
main()
# (() => await main())()