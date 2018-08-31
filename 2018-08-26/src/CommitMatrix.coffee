# @flow

{ union, difference, sortBy } = require './util'

###::
type Score = number
type FileScore = {
  fileName: FileName,
  score: Score
}
type CommitterFileScores = {
  email: CommitEmail,
  fileScores: Array<FileScore>
}

// commitFile and fileScore are for the same file.
type CommitFileScoreReducer =
  ({
    commitFile: CommitFile,
    fileScore: FileScore
  }) => Score
###

class CommitMatrix
  ###::
  matrix: Array<CommitterFileScores>
  files: Array<FileName>
  emails: Array<CommitEmail>
  commitFileScoreReducer: CommitFileScoreReducer
  ###

  constructor: (commitFileScoreReducer) ->
    @matrix = []
    @files = []
    @emails = []
    @commitFileScoreReducer = commitFileScoreReducer
  
  addCommit: (commit ###: Commit ###) =>
    @emails = union @emails, [commit.email]
    commitFileNames = commit.files.map (file) => file.name
    @files = union @files, commitFileNames
    @reshapeMatrix()
    committer = @matrix.find (committer) =>
      committer.email == commit.email
    throw new Error 'Matrix did not container committer' if !committer
    committer.fileScores.forEach (fileScore) =>
      commitFile = commit.files.find (file) =>
        file.name == fileScore.fileName
      fileScore.score =
        @commitFileScoreReducer { commitFile, fileScore }

  # Ensure that we have an entry in the matrix for every email in `@emails`,
  # and ensure that every committer has an entry for every file in `@files`.
  reshapeMatrix: () =>
    currentEmails = @matrix.map (committer) => committer[0]
    newEmails = difference @emails, currentEmails
    newEmails.forEach (email) => 
      @matrix.push { email, fileScores: [] }
    @matrix.forEach (committer) =>
      fileScores = committer.fileScores
      currentFiles = fileScores.map (fileScore) => fileScore.fileName
      newFiles = difference @files, currentFiles
      newFiles.forEach (fileName) =>
        fileScores.push { fileName, score: 0 }

  sort: () =>
    @files = @files.sort()
    @emails = @emails.sort()
    @matrix = sortBy @matrix, (committer) => committer.email
    @matrix = @matrix.map (committer) =>
      {
        email: committer.email,
        fileScores: sortBy committer.fileScores, (fileScore) => fileScore.fileName
      }

module.exports = CommitMatrix