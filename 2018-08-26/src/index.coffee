# @flow

{ Transform } = require 'stream'
{ spawn } = require 'child_process'
{ compact, last, difference, isEmpty, trim, union, sortBy } = require 'lodash'
{ inspect } = require 'util'



debug = (...xs) => console.debug inspect xs, { depth: null }



matchCommitHeader = (str) ###: ?Commit ### =>
  matches = str.match(/^(\d+) (.*@.*)$/)
  return null if !matches
  {
    time: Number matches[1]
    email: matches[2]
    files: []
  }


###::
type Commit = {
  time: number,
  email: string,
  files: Array<{
    name: string,
    added: number,
    deleted: number
  }>
}
###



parseCommitChanges = (lines) =>
  lines.map (line) =>
    parts = line.split '\t'
    {
      added: Number parts[0]
      deleted: Number parts[1]
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
          existingFile.added += changedFile.added
          existingFile.deleted += changedFile.deleted
        else
          commit.files.push changedFile
      commits
    , []
    commitObjects.forEach (commit) => @push commit



class UserFileChangeCountMatrix
  ###::
  matrix: Array<[string, Array<[string, number]>]>
  files: Array<string>
  emails: Array<string>
  ###

  constructor: () ->
    # The matrix is a table with users along one axis and files along the other
    # axis, and the number of changed lines a user has for a file as the cell.
    # We store the matrix internally as a 2-dimensional array of size 
    # `<num users> x <num files>`, and where each entry is a key-value pair.
    # The user entry is outermost and the file entry is innermost. The user 
    # entry is of the form `[ <email>, [ <file entry> ] ]`, and the 
    # file entry is of the form `[ <filename>, <user file line change count> ]`.
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
  
  addCommit: (commit) ->
    @emails = union @emails, [commit.email]
    commitFileNames = commit.files.map (file) => file.name
    @files = union @files, commitFileNames
    @reshapeMatrix()
    user = @matrix.find (u) => u[0] == commit.email
    throw new Error 'Matrix did not container user' if !user
    userFiles = user[1]
    userFiles.forEach (userFile) =>
      commitFile = commit.files.find (file) => file.name == userFile[0]
      if commitFile
        userFile[1] += commitFile.added + commitFile.deleted

  # Ensure that we have an entry in the matrix for every email in `@emails`,
  # and ensure that every user has an entry for every file in `@files`.
  reshapeMatrix: () ->
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

  sort: () ->
    @files = @files.sort()
    @emails = @emails.sort()
    @matrix = sortBy @matrix, (user) => user[0]
    @matrix = @matrix.map (user) =>
      [
        user[0],
        sortBy user[1], (file) => file[0]
      ]


elMap = (xs) => (f) => (xs.map f).join '\n'


matrixToHtml = (matrix ###: UserFileChangeCountMatrix ###) ###: string ### =>
  emails = elMap matrix.emails
  emailHeadings = emails (email) => "<th scope='col'>#{email}</th>"
  users = elMap matrix.matrix
  fileRows = users (user) =>
    files = elMap user[1]
    files (file, i) =>
      fileCols = users (user) => "<td>#{user[1][i][1]}</td>"
      """
      <tr>
        <th scope='row'>#{file[0]}</th>
        #{fileCols}
      </tr>
      """
  """
  <table>
    <tr>
      <td></td>
      #{emailHeadings}
    </tr>
    #{fileRows}
  </table>
  """


main = () =>
  changesProc =
    spawn 'git',
      ['--no-pager', 'log', '--format=%n%n%ct %ae', '--numstat', '--no-merges', '--no-renames'],
      { env: { ...process.env, GIT_FLUSH: 0 } }
  changesRawStream = changesProc.stdout
  changesObjectStream = new ChangesObjectStream
  changesRawStream.pipe changesObjectStream
  matrix = new UserFileChangeCountMatrix
  end = new Promise (resolve, reject) =>
    changesObjectStream.on 'data', (commit) => matrix.addCommit commit
    changesProc.on 'exit', () =>
      matrix.sort()
      console.log matrixToHtml matrix
      resolve()

  await end


main()