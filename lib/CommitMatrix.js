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
*/
CommitMatrix = class CommitMatrix {
  /*::
  matrix: Array<CommitterFileScores>
  files: Array<FileName>
  emails: Array<CommitEmail>
  commitFileScoreReducer: CommitFileScoreReducer
  */
  constructor(commitFileScoreReducer) {
    this.addCommit = this.addCommit.bind(this);
    // Ensure that we have an entry in the matrix for every email in `@emails`,
    // and ensure that every committer has an entry for every file in `@files`.
    this.reshapeMatrix = this.reshapeMatrix.bind(this);
    this.sort = this.sort.bind(this);
    this.matrix = [];
    this.files = [];
    this.emails = [];
    this.commitFileScoreReducer = commitFileScoreReducer;
  }

  addCommit(commit/*: Commit */) {
    var commitFileNames, committer;
    this.emails = union(this.emails, [commit.email]);
    commitFileNames = commit.files.map((file) => {
      return file.name;
    });
    this.files = union(this.files, commitFileNames);
    this.reshapeMatrix();
    committer = this.matrix.find((committer) => {
      return committer.email === commit.email;
    });
    if (!committer) {
      throw new Error('Matrix did not container committer');
    }
    return committer.fileScores.forEach((fileScore) => {
      var commitFile;
      commitFile = commit.files.find((file) => {
        return file.name === fileScore.fileName;
      });
      if (commitFile) {
        return fileScore.score = this.commitFileScoreReducer({commitFile, fileScore});
      }
    });
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
      var currentFiles, fileScores, newFiles;
      fileScores = committer.fileScores;
      currentFiles = fileScores.map((fileScore) => {
        return fileScore.fileName;
      });
      newFiles = difference(this.files, currentFiles);
      return newFiles.forEach((fileName) => {
        return fileScores.push({
          fileName,
          score: 0
        });
      });
    });
  }

  sort() {
    this.files = this.files.sort();
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

};

module.exports = CommitMatrix;

//# sourceMappingURL=CommitMatrix.js.map
