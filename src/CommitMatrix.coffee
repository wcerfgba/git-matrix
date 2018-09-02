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

type MatrixFile = {
  name: FileName,
  totalScore: Score
}
###

class CommitMatrix
  ###::
  matrix: Array<CommitterFileScores>
  files: Array<MatrixFile>
  emails: Array<CommitEmail>
  commitFileScoreReducer: CommitFileScoreReducer
  ###

  constructor: (commitFileScoreReducer) ->
    @matrix = []
    @files = []
    @emails = []
    @commitFileScoreReducer = commitFileScoreReducer
  
  addCommit: (commit ###: Commit ###) =>
    @addCommitEmails commit
    @addCommitFiles commit
    @reshapeMatrix()
    committer = @matrix.find (committer) =>
      committer.email == commit.email
    throw new Error 'Matrix did not container committer' if !committer
    committer.fileScores.forEach (fileScore) =>
      isFileScoreFile = (file) => file.name == fileScore.fileName
      commitFile = commit.files.find isFileScoreFile
      matrixFile = @files.find isFileScoreFile
      if commitFile
        score = @commitFileScoreReducer { commitFile, fileScore }
        fileScore.score += score
        matrixFile.totalScore += score

  addCommitEmails: (commit) =>
    @emails = union @emails, [commit.email]

  addCommitFiles: (commit) =>
    commitFileNames = commit.files.map (file) => file.name
    # @files = union @files, commitFileNames
    newFileNames = difference commitFileNames, @fileNames()
    newFiles = newFileNames.map (fileName) =>
      { name: fileName, totalScore: 0 }
    @files = union @files, newFiles

  # Ensure that we have an entry in the matrix for every email in `@emails`,
  # and ensure that every committer has an entry for every file in `@files`.
  reshapeMatrix: () =>
    currentEmails = @matrix.map (committer) => committer.email
    newEmails = difference @emails, currentEmails
    newEmails.forEach (email) => 
      @matrix.push { email, fileScores: [] }
    @matrix.forEach (committer) =>
      committerFileNames = committer.fileScores.map (fileScore) => fileScore.fileName
      missingFileNames = difference @fileNames(), committerFileNames
      missingFileNames.forEach (fileName) =>
        committer.fileScores.push { fileName, score: 0 }

  sort: () =>
    @files = sortBy @files, (file) => file.name
    @emails = @emails.sort()
    @matrix = sortBy @matrix, (committer) => committer.email
    @matrix = @matrix.map (committer) =>
      {
        email: committer.email,
        fileScores: sortBy committer.fileScores, (fileScore) => fileScore.fileName
      }

  fileNames: () => @files.map (file) => file.name

module.exports = CommitMatrix