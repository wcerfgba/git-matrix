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
      return fileScore.score = this.commitFileScoreReducer({commitFile, fileScore});
    });
  }

  reshapeMatrix() {
    var currentEmails, newEmails;
    currentEmails = this.matrix.map((committer) => {
      return committer[0];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0TWF0cml4LmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJzcmMvQ29tbWl0TWF0cml4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLElBQUEsWUFBQSxFQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxVQUFULEVBQXFCLE1BQXJCLENBQUEsR0FBZ0MsT0FBQSxDQUFRLFFBQVIsQ0FBaEMsRUFGQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Qk0sZUFBTixNQUFBLGFBQUEsQ0FBQTs7Ozs7OztFQVFFLFdBQWEsQ0FBQyxzQkFBRCxDQUFBO1FBTWIsQ0FBQSxnQkFBQSxDQUFBLHFCQUxFOzs7UUFxQkYsQ0FBQSxvQkFBQSxDQUFBO1FBWUEsQ0FBQSxXQUFBLENBQUE7SUFqQ0UsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLHNCQUFELEdBQTBCO0VBSmY7O0VBTWIsU0FBVyxDQUFDLG1CQUFELENBQUE7QUFDVCxRQUFBLGVBQUEsRUFBQTtJQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBQSxDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBUixDQUFmO0lBQ1YsZUFBQSxHQUFrQixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQWIsQ0FBaUIsQ0FBQyxJQUFELENBQUEsR0FBQTthQUFVLElBQUksQ0FBQztJQUFmLENBQWpCO0lBQ2xCLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQSxDQUFNLElBQUMsQ0FBQSxLQUFQLEVBQWMsZUFBZDtJQUNULElBQUMsQ0FBQSxhQUFELENBQUE7SUFDQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsQ0FBQyxTQUFELENBQUEsR0FBQTthQUN2QixTQUFTLENBQUMsS0FBVixLQUFtQixNQUFNLENBQUM7SUFESCxDQUFiO0lBRVosSUFBd0QsQ0FBQyxTQUF6RDtNQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsb0NBQVYsRUFBTjs7V0FDQSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQXJCLENBQTZCLENBQUMsU0FBRCxDQUFBLEdBQUE7QUFDM0IsVUFBQTtNQUFBLFVBQUEsR0FBYSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWIsQ0FBa0IsQ0FBQyxJQUFELENBQUEsR0FBQTtlQUM3QixJQUFJLENBQUMsSUFBTCxLQUFhLFNBQVMsQ0FBQztNQURNLENBQWxCO2FBRWIsU0FBUyxDQUFDLEtBQVYsR0FDRSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsQ0FBRSxVQUFGLEVBQWMsU0FBZCxDQUF4QjtJQUp5QixDQUE3QjtFQVJTOztFQWdCWCxhQUFlLENBQUEsQ0FBQTtBQUNiLFFBQUEsYUFBQSxFQUFBO0lBQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxDQUFDLFNBQUQsQ0FBQSxHQUFBO2FBQWUsU0FBVSxDQUFBLENBQUE7SUFBekIsQ0FBWjtJQUNoQixTQUFBLEdBQVksVUFBQSxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBQW9CLGFBQXBCO0lBQ1osU0FBUyxDQUFDLE9BQVYsQ0FBa0IsQ0FBQyxLQUFELENBQUEsR0FBQTthQUNoQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYTtRQUFFLEtBQUY7UUFBUyxVQUFBLEVBQVk7TUFBckIsQ0FBYjtJQURnQixDQUFsQjtXQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixDQUFDLFNBQUQsQ0FBQSxHQUFBO0FBQ2QsVUFBQSxZQUFBLEVBQUEsVUFBQSxFQUFBO01BQUEsVUFBQSxHQUFhLFNBQVMsQ0FBQztNQUN2QixZQUFBLEdBQWUsVUFBVSxDQUFDLEdBQVgsQ0FBZSxDQUFDLFNBQUQsQ0FBQSxHQUFBO2VBQWUsU0FBUyxDQUFDO01BQXpCLENBQWY7TUFDZixRQUFBLEdBQVcsVUFBQSxDQUFXLElBQUMsQ0FBQSxLQUFaLEVBQW1CLFlBQW5CO2FBQ1gsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBQyxRQUFELENBQUEsR0FBQTtlQUNmLFVBQVUsQ0FBQyxJQUFYLENBQWdCO1VBQUUsUUFBRjtVQUFZLEtBQUEsRUFBTztRQUFuQixDQUFoQjtNQURlLENBQWpCO0lBSmMsQ0FBaEI7RUFMYTs7RUFZZixJQUFNLENBQUEsQ0FBQTtJQUNKLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFBO0lBQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFBLENBQU8sSUFBQyxDQUFBLE1BQVIsRUFBZ0IsQ0FBQyxTQUFELENBQUEsR0FBQTthQUFlLFNBQVMsQ0FBQztJQUF6QixDQUFoQjtXQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksQ0FBQyxTQUFELENBQUEsR0FBQTthQUNwQjtRQUNFLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FEbkI7UUFFRSxVQUFBLEVBQVksTUFBQSxDQUFPLFNBQVMsQ0FBQyxVQUFqQixFQUE2QixDQUFDLFNBQUQsQ0FBQSxHQUFBO2lCQUFlLFNBQVMsQ0FBQztRQUF6QixDQUE3QjtNQUZkO0lBRG9CLENBQVo7RUFKTjs7QUExQ1I7O0FBb0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyBAZmxvd1xuXG57IHVuaW9uLCBkaWZmZXJlbmNlLCBzb3J0QnkgfSA9IHJlcXVpcmUgJy4vdXRpbCdcblxuIyMjOjpcbnR5cGUgU2NvcmUgPSBudW1iZXJcbnR5cGUgRmlsZVNjb3JlID0ge1xuICBmaWxlTmFtZTogRmlsZU5hbWUsXG4gIHNjb3JlOiBTY29yZVxufVxudHlwZSBDb21taXR0ZXJGaWxlU2NvcmVzID0ge1xuICBlbWFpbDogQ29tbWl0RW1haWwsXG4gIGZpbGVTY29yZXM6IEFycmF5PEZpbGVTY29yZT5cbn1cblxuLy8gY29tbWl0RmlsZSBhbmQgZmlsZVNjb3JlIGFyZSBmb3IgdGhlIHNhbWUgZmlsZS5cbnR5cGUgQ29tbWl0RmlsZVNjb3JlUmVkdWNlciA9XG4gICh7XG4gICAgY29tbWl0RmlsZTogQ29tbWl0RmlsZSxcbiAgICBmaWxlU2NvcmU6IEZpbGVTY29yZVxuICB9KSA9PiBTY29yZVxuIyMjXG5cbmNsYXNzIENvbW1pdE1hdHJpeFxuICAjIyM6OlxuICBtYXRyaXg6IEFycmF5PENvbW1pdHRlckZpbGVTY29yZXM+XG4gIGZpbGVzOiBBcnJheTxGaWxlTmFtZT5cbiAgZW1haWxzOiBBcnJheTxDb21taXRFbWFpbD5cbiAgY29tbWl0RmlsZVNjb3JlUmVkdWNlcjogQ29tbWl0RmlsZVNjb3JlUmVkdWNlclxuICAjIyNcblxuICBjb25zdHJ1Y3RvcjogKGNvbW1pdEZpbGVTY29yZVJlZHVjZXIpIC0+XG4gICAgQG1hdHJpeCA9IFtdXG4gICAgQGZpbGVzID0gW11cbiAgICBAZW1haWxzID0gW11cbiAgICBAY29tbWl0RmlsZVNjb3JlUmVkdWNlciA9IGNvbW1pdEZpbGVTY29yZVJlZHVjZXJcbiAgXG4gIGFkZENvbW1pdDogKGNvbW1pdCAjIyM6IENvbW1pdCAjIyMpID0+XG4gICAgQGVtYWlscyA9IHVuaW9uIEBlbWFpbHMsIFtjb21taXQuZW1haWxdXG4gICAgY29tbWl0RmlsZU5hbWVzID0gY29tbWl0LmZpbGVzLm1hcCAoZmlsZSkgPT4gZmlsZS5uYW1lXG4gICAgQGZpbGVzID0gdW5pb24gQGZpbGVzLCBjb21taXRGaWxlTmFtZXNcbiAgICBAcmVzaGFwZU1hdHJpeCgpXG4gICAgY29tbWl0dGVyID0gQG1hdHJpeC5maW5kIChjb21taXR0ZXIpID0+XG4gICAgICBjb21taXR0ZXIuZW1haWwgPT0gY29tbWl0LmVtYWlsXG4gICAgdGhyb3cgbmV3IEVycm9yICdNYXRyaXggZGlkIG5vdCBjb250YWluZXIgY29tbWl0dGVyJyBpZiAhY29tbWl0dGVyXG4gICAgY29tbWl0dGVyLmZpbGVTY29yZXMuZm9yRWFjaCAoZmlsZVNjb3JlKSA9PlxuICAgICAgY29tbWl0RmlsZSA9IGNvbW1pdC5maWxlcy5maW5kIChmaWxlKSA9PlxuICAgICAgICBmaWxlLm5hbWUgPT0gZmlsZVNjb3JlLmZpbGVOYW1lXG4gICAgICBmaWxlU2NvcmUuc2NvcmUgPVxuICAgICAgICBAY29tbWl0RmlsZVNjb3JlUmVkdWNlciB7IGNvbW1pdEZpbGUsIGZpbGVTY29yZSB9XG5cbiAgIyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGFuIGVudHJ5IGluIHRoZSBtYXRyaXggZm9yIGV2ZXJ5IGVtYWlsIGluIGBAZW1haWxzYCxcbiAgIyBhbmQgZW5zdXJlIHRoYXQgZXZlcnkgY29tbWl0dGVyIGhhcyBhbiBlbnRyeSBmb3IgZXZlcnkgZmlsZSBpbiBgQGZpbGVzYC5cbiAgcmVzaGFwZU1hdHJpeDogKCkgPT5cbiAgICBjdXJyZW50RW1haWxzID0gQG1hdHJpeC5tYXAgKGNvbW1pdHRlcikgPT4gY29tbWl0dGVyWzBdXG4gICAgbmV3RW1haWxzID0gZGlmZmVyZW5jZSBAZW1haWxzLCBjdXJyZW50RW1haWxzXG4gICAgbmV3RW1haWxzLmZvckVhY2ggKGVtYWlsKSA9PiBcbiAgICAgIEBtYXRyaXgucHVzaCB7IGVtYWlsLCBmaWxlU2NvcmVzOiBbXSB9XG4gICAgQG1hdHJpeC5mb3JFYWNoIChjb21taXR0ZXIpID0+XG4gICAgICBmaWxlU2NvcmVzID0gY29tbWl0dGVyLmZpbGVTY29yZXNcbiAgICAgIGN1cnJlbnRGaWxlcyA9IGZpbGVTY29yZXMubWFwIChmaWxlU2NvcmUpID0+IGZpbGVTY29yZS5maWxlTmFtZVxuICAgICAgbmV3RmlsZXMgPSBkaWZmZXJlbmNlIEBmaWxlcywgY3VycmVudEZpbGVzXG4gICAgICBuZXdGaWxlcy5mb3JFYWNoIChmaWxlTmFtZSkgPT5cbiAgICAgICAgZmlsZVNjb3Jlcy5wdXNoIHsgZmlsZU5hbWUsIHNjb3JlOiAwIH1cblxuICBzb3J0OiAoKSA9PlxuICAgIEBmaWxlcyA9IEBmaWxlcy5zb3J0KClcbiAgICBAZW1haWxzID0gQGVtYWlscy5zb3J0KClcbiAgICBAbWF0cml4ID0gc29ydEJ5IEBtYXRyaXgsIChjb21taXR0ZXIpID0+IGNvbW1pdHRlci5lbWFpbFxuICAgIEBtYXRyaXggPSBAbWF0cml4Lm1hcCAoY29tbWl0dGVyKSA9PlxuICAgICAge1xuICAgICAgICBlbWFpbDogY29tbWl0dGVyLmVtYWlsLFxuICAgICAgICBmaWxlU2NvcmVzOiBzb3J0QnkgY29tbWl0dGVyLmZpbGVTY29yZXMsIChmaWxlU2NvcmUpID0+IGZpbGVTY29yZS5maWxlTmFtZVxuICAgICAgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1pdE1hdHJpeCJdfQ==
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/CommitMatrix.coffee