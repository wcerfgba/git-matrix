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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0TWF0cml4LmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJzcmMvQ29tbWl0TWF0cml4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLElBQUEsWUFBQSxFQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxVQUFULEVBQXFCLE1BQXJCLENBQUEsR0FBZ0MsT0FBQSxDQUFRLFFBQVIsQ0FBaEMsRUFGQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Qk0sZUFBTixNQUFBLGFBQUEsQ0FBQTs7Ozs7OztFQVFFLFdBQWEsQ0FBQyxzQkFBRCxDQUFBO1FBTWIsQ0FBQSxnQkFBQSxDQUFBLHFCQUxFOzs7UUFzQkYsQ0FBQSxvQkFBQSxDQUFBO1FBWUEsQ0FBQSxXQUFBLENBQUE7SUFsQ0UsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLHNCQUFELEdBQTBCO0VBSmY7O0VBTWIsU0FBVyxDQUFDLG1CQUFELENBQUE7QUFDVCxRQUFBLGVBQUEsRUFBQTtJQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBQSxDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBUixDQUFmO0lBQ1YsZUFBQSxHQUFrQixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQWIsQ0FBaUIsQ0FBQyxJQUFELENBQUEsR0FBQTthQUFVLElBQUksQ0FBQztJQUFmLENBQWpCO0lBQ2xCLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQSxDQUFNLElBQUMsQ0FBQSxLQUFQLEVBQWMsZUFBZDtJQUNULElBQUMsQ0FBQSxhQUFELENBQUE7SUFDQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsQ0FBQyxTQUFELENBQUEsR0FBQTthQUN2QixTQUFTLENBQUMsS0FBVixLQUFtQixNQUFNLENBQUM7SUFESCxDQUFiO0lBRVosSUFBd0QsQ0FBQyxTQUF6RDtNQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsb0NBQVYsRUFBTjs7V0FDQSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQXJCLENBQTZCLENBQUMsU0FBRCxDQUFBLEdBQUE7QUFDM0IsVUFBQTtNQUFBLFVBQUEsR0FBYSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWIsQ0FBa0IsQ0FBQyxJQUFELENBQUEsR0FBQTtlQUM3QixJQUFJLENBQUMsSUFBTCxLQUFhLFNBQVMsQ0FBQztNQURNLENBQWxCO01BRWIsSUFBRyxVQUFIO2VBQ0UsU0FBUyxDQUFDLEtBQVYsR0FDRSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsQ0FBRSxVQUFGLEVBQWMsU0FBZCxDQUF4QixFQUZKOztJQUgyQixDQUE3QjtFQVJTOztFQWlCWCxhQUFlLENBQUEsQ0FBQTtBQUNiLFFBQUEsYUFBQSxFQUFBO0lBQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxDQUFDLFNBQUQsQ0FBQSxHQUFBO2FBQWUsU0FBUyxDQUFDO0lBQXpCLENBQVo7SUFDaEIsU0FBQSxHQUFZLFVBQUEsQ0FBVyxJQUFDLENBQUEsTUFBWixFQUFvQixhQUFwQjtJQUNaLFNBQVMsQ0FBQyxPQUFWLENBQWtCLENBQUMsS0FBRCxDQUFBLEdBQUE7YUFDaEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWE7UUFBRSxLQUFGO1FBQVMsVUFBQSxFQUFZO01BQXJCLENBQWI7SUFEZ0IsQ0FBbEI7V0FFQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxTQUFELENBQUEsR0FBQTtBQUNkLFVBQUEsWUFBQSxFQUFBLFVBQUEsRUFBQTtNQUFBLFVBQUEsR0FBYSxTQUFTLENBQUM7TUFDdkIsWUFBQSxHQUFlLFVBQVUsQ0FBQyxHQUFYLENBQWUsQ0FBQyxTQUFELENBQUEsR0FBQTtlQUFlLFNBQVMsQ0FBQztNQUF6QixDQUFmO01BQ2YsUUFBQSxHQUFXLFVBQUEsQ0FBVyxJQUFDLENBQUEsS0FBWixFQUFtQixZQUFuQjthQUNYLFFBQVEsQ0FBQyxPQUFULENBQWlCLENBQUMsUUFBRCxDQUFBLEdBQUE7ZUFDZixVQUFVLENBQUMsSUFBWCxDQUFnQjtVQUFFLFFBQUY7VUFBWSxLQUFBLEVBQU87UUFBbkIsQ0FBaEI7TUFEZSxDQUFqQjtJQUpjLENBQWhCO0VBTGE7O0VBWWYsSUFBTSxDQUFBLENBQUE7SUFDSixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO0lBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBQTtJQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBQSxDQUFPLElBQUMsQ0FBQSxNQUFSLEVBQWdCLENBQUMsU0FBRCxDQUFBLEdBQUE7YUFBZSxTQUFTLENBQUM7SUFBekIsQ0FBaEI7V0FDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsR0FBUixDQUFZLENBQUMsU0FBRCxDQUFBLEdBQUE7YUFDcEI7UUFDRSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBRG5CO1FBRUUsVUFBQSxFQUFZLE1BQUEsQ0FBTyxTQUFTLENBQUMsVUFBakIsRUFBNkIsQ0FBQyxTQUFELENBQUEsR0FBQTtpQkFBZSxTQUFTLENBQUM7UUFBekIsQ0FBN0I7TUFGZDtJQURvQixDQUFaO0VBSk47O0FBM0NSOztBQXFEQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgQGZsb3dcblxueyB1bmlvbiwgZGlmZmVyZW5jZSwgc29ydEJ5IH0gPSByZXF1aXJlICcuL3V0aWwnXG5cbiMjIzo6XG50eXBlIFNjb3JlID0gbnVtYmVyXG50eXBlIEZpbGVTY29yZSA9IHtcbiAgZmlsZU5hbWU6IEZpbGVOYW1lLFxuICBzY29yZTogU2NvcmVcbn1cbnR5cGUgQ29tbWl0dGVyRmlsZVNjb3JlcyA9IHtcbiAgZW1haWw6IENvbW1pdEVtYWlsLFxuICBmaWxlU2NvcmVzOiBBcnJheTxGaWxlU2NvcmU+XG59XG5cbi8vIGNvbW1pdEZpbGUgYW5kIGZpbGVTY29yZSBhcmUgZm9yIHRoZSBzYW1lIGZpbGUuXG50eXBlIENvbW1pdEZpbGVTY29yZVJlZHVjZXIgPVxuICAoe1xuICAgIGNvbW1pdEZpbGU6IENvbW1pdEZpbGUsXG4gICAgZmlsZVNjb3JlOiBGaWxlU2NvcmVcbiAgfSkgPT4gU2NvcmVcbiMjI1xuXG5jbGFzcyBDb21taXRNYXRyaXhcbiAgIyMjOjpcbiAgbWF0cml4OiBBcnJheTxDb21taXR0ZXJGaWxlU2NvcmVzPlxuICBmaWxlczogQXJyYXk8RmlsZU5hbWU+XG4gIGVtYWlsczogQXJyYXk8Q29tbWl0RW1haWw+XG4gIGNvbW1pdEZpbGVTY29yZVJlZHVjZXI6IENvbW1pdEZpbGVTY29yZVJlZHVjZXJcbiAgIyMjXG5cbiAgY29uc3RydWN0b3I6IChjb21taXRGaWxlU2NvcmVSZWR1Y2VyKSAtPlxuICAgIEBtYXRyaXggPSBbXVxuICAgIEBmaWxlcyA9IFtdXG4gICAgQGVtYWlscyA9IFtdXG4gICAgQGNvbW1pdEZpbGVTY29yZVJlZHVjZXIgPSBjb21taXRGaWxlU2NvcmVSZWR1Y2VyXG4gIFxuICBhZGRDb21taXQ6IChjb21taXQgIyMjOiBDb21taXQgIyMjKSA9PlxuICAgIEBlbWFpbHMgPSB1bmlvbiBAZW1haWxzLCBbY29tbWl0LmVtYWlsXVxuICAgIGNvbW1pdEZpbGVOYW1lcyA9IGNvbW1pdC5maWxlcy5tYXAgKGZpbGUpID0+IGZpbGUubmFtZVxuICAgIEBmaWxlcyA9IHVuaW9uIEBmaWxlcywgY29tbWl0RmlsZU5hbWVzXG4gICAgQHJlc2hhcGVNYXRyaXgoKVxuICAgIGNvbW1pdHRlciA9IEBtYXRyaXguZmluZCAoY29tbWl0dGVyKSA9PlxuICAgICAgY29tbWl0dGVyLmVtYWlsID09IGNvbW1pdC5lbWFpbFxuICAgIHRocm93IG5ldyBFcnJvciAnTWF0cml4IGRpZCBub3QgY29udGFpbmVyIGNvbW1pdHRlcicgaWYgIWNvbW1pdHRlclxuICAgIGNvbW1pdHRlci5maWxlU2NvcmVzLmZvckVhY2ggKGZpbGVTY29yZSkgPT5cbiAgICAgIGNvbW1pdEZpbGUgPSBjb21taXQuZmlsZXMuZmluZCAoZmlsZSkgPT5cbiAgICAgICAgZmlsZS5uYW1lID09IGZpbGVTY29yZS5maWxlTmFtZVxuICAgICAgaWYgY29tbWl0RmlsZVxuICAgICAgICBmaWxlU2NvcmUuc2NvcmUgPVxuICAgICAgICAgIEBjb21taXRGaWxlU2NvcmVSZWR1Y2VyIHsgY29tbWl0RmlsZSwgZmlsZVNjb3JlIH1cblxuICAjIEVuc3VyZSB0aGF0IHdlIGhhdmUgYW4gZW50cnkgaW4gdGhlIG1hdHJpeCBmb3IgZXZlcnkgZW1haWwgaW4gYEBlbWFpbHNgLFxuICAjIGFuZCBlbnN1cmUgdGhhdCBldmVyeSBjb21taXR0ZXIgaGFzIGFuIGVudHJ5IGZvciBldmVyeSBmaWxlIGluIGBAZmlsZXNgLlxuICByZXNoYXBlTWF0cml4OiAoKSA9PlxuICAgIGN1cnJlbnRFbWFpbHMgPSBAbWF0cml4Lm1hcCAoY29tbWl0dGVyKSA9PiBjb21taXR0ZXIuZW1haWxcbiAgICBuZXdFbWFpbHMgPSBkaWZmZXJlbmNlIEBlbWFpbHMsIGN1cnJlbnRFbWFpbHNcbiAgICBuZXdFbWFpbHMuZm9yRWFjaCAoZW1haWwpID0+IFxuICAgICAgQG1hdHJpeC5wdXNoIHsgZW1haWwsIGZpbGVTY29yZXM6IFtdIH1cbiAgICBAbWF0cml4LmZvckVhY2ggKGNvbW1pdHRlcikgPT5cbiAgICAgIGZpbGVTY29yZXMgPSBjb21taXR0ZXIuZmlsZVNjb3Jlc1xuICAgICAgY3VycmVudEZpbGVzID0gZmlsZVNjb3Jlcy5tYXAgKGZpbGVTY29yZSkgPT4gZmlsZVNjb3JlLmZpbGVOYW1lXG4gICAgICBuZXdGaWxlcyA9IGRpZmZlcmVuY2UgQGZpbGVzLCBjdXJyZW50RmlsZXNcbiAgICAgIG5ld0ZpbGVzLmZvckVhY2ggKGZpbGVOYW1lKSA9PlxuICAgICAgICBmaWxlU2NvcmVzLnB1c2ggeyBmaWxlTmFtZSwgc2NvcmU6IDAgfVxuXG4gIHNvcnQ6ICgpID0+XG4gICAgQGZpbGVzID0gQGZpbGVzLnNvcnQoKVxuICAgIEBlbWFpbHMgPSBAZW1haWxzLnNvcnQoKVxuICAgIEBtYXRyaXggPSBzb3J0QnkgQG1hdHJpeCwgKGNvbW1pdHRlcikgPT4gY29tbWl0dGVyLmVtYWlsXG4gICAgQG1hdHJpeCA9IEBtYXRyaXgubWFwIChjb21taXR0ZXIpID0+XG4gICAgICB7XG4gICAgICAgIGVtYWlsOiBjb21taXR0ZXIuZW1haWwsXG4gICAgICAgIGZpbGVTY29yZXM6IHNvcnRCeSBjb21taXR0ZXIuZmlsZVNjb3JlcywgKGZpbGVTY29yZSkgPT4gZmlsZVNjb3JlLmZpbGVOYW1lXG4gICAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWl0TWF0cml4Il19
//# sourceURL=/home/jpreston/Sync/proj/eyeson/src/CommitMatrix.coffee