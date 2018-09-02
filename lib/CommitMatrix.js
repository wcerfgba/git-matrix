// @flow
var CommitMatrix, difference, sortBy, union;

({union, difference, sortBy} = require('./util'));

/*::
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
*/
CommitMatrix = class CommitMatrix {
  /*::
  matrix: Array<CommitterFileScores>
  files: Array<MatrixFile>
  emails: Array<CommitEmail>
  commitFileScoreReducer: CommitFileScoreReducer
  */
  constructor(commitFileScoreReducer) {
    this.addCommit = this.addCommit.bind(this);
    this.addCommitEmails = this.addCommitEmails.bind(this);
    this.addCommitFiles = this.addCommitFiles.bind(this);
    // Ensure that we have an entry in the matrix for every email in `@emails`,
    // and ensure that every committer has an entry for every file in `@files`.
    this.reshapeMatrix = this.reshapeMatrix.bind(this);
    this.sort = this.sort.bind(this);
    this.fileNames = this.fileNames.bind(this);
    this.matrix = [];
    this.files = [];
    this.emails = [];
    this.commitFileScoreReducer = commitFileScoreReducer;
  }

  addCommit(commit/*: Commit */) {
    var committer;
    this.addCommitEmails(commit);
    this.addCommitFiles(commit);
    this.reshapeMatrix();
    committer = this.matrix.find((committer) => {
      return committer.email === commit.email;
    });
    if (!committer) {
      throw new Error('Matrix did not container committer');
    }
    return committer.fileScores.forEach((fileScore) => {
      var commitFile, isFileScoreFile, matrixFile, score;
      isFileScoreFile = (file) => {
        return file.name === fileScore.fileName;
      };
      commitFile = commit.files.find(isFileScoreFile);
      matrixFile = this.files.find(isFileScoreFile);
      if (commitFile) {
        score = this.commitFileScoreReducer({commitFile, fileScore});
        fileScore.score += score;
        return matrixFile.totalScore += score;
      }
    });
  }

  addCommitEmails(commit) {
    return this.emails = union(this.emails, [commit.email]);
  }

  addCommitFiles(commit) {
    var commitFileNames, newFileNames, newFiles;
    commitFileNames = commit.files.map((file) => {
      return file.name;
    });
    // @files = union @files, commitFileNames
    newFileNames = difference(commitFileNames, this.fileNames());
    newFiles = newFileNames.map((fileName) => {
      return {
        name: fileName,
        totalScore: 0
      };
    });
    return this.files = union(this.files, newFiles);
  }

  reshapeMatrix() {
    var currentEmails, newEmails;
    currentEmails = this.matrix.map((committer) => {
      return committer.email;
    });
    newEmails = difference(this.emails, currentEmails);
    newEmails.forEach((email) => {
      return this.matrix.push({
        email,
        fileScores: []
      });
    });
    return this.matrix.forEach((committer) => {
      var committerFileNames, missingFileNames;
      committerFileNames = committer.fileScores.map((fileScore) => {
        return fileScore.fileName;
      });
      missingFileNames = difference(this.fileNames(), committerFileNames);
      return missingFileNames.forEach((fileName) => {
        return committer.fileScores.push({
          fileName,
          score: 0
        });
      });
    });
  }

  sort() {
    this.files = sortBy(this.files, (file) => {
      return file.name;
    });
    this.emails = this.emails.sort();
    this.matrix = sortBy(this.matrix, (committer) => {
      return committer.email;
    });
    return this.matrix = this.matrix.map((committer) => {
      return {
        email: committer.email,
        fileScores: sortBy(committer.fileScores, (fileScore) => {
          return fileScore.fileName;
        })
      };
    });
  }

  fileNames() {
    return this.files.map((file) => {
      return file.name;
    });
  }

};

module.exports = CommitMatrix;

//# sourceMappingURL=CommitMatrix.js.map
