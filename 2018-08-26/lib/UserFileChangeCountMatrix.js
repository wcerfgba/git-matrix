// @flow
var UserFileChangeCountMatrix, difference, sortBy, union;

({union, difference, sortBy} = require('./util'));

UserFileChangeCountMatrix = class UserFileChangeCountMatrix {
  /*::
  matrix: Array<[string, Array<[string, number]>]>
  files: Array<string>
  emails: Array<string>
  */
  constructor() {
    // The matrix is a table with users along one axis and files along the other
    // axis, and the number of changed lines a user has for a file as the cell.
    // We store the matrix internally as a 2-dimensional array of size 
    // `<num users> x <num files>`, and where each entry is a key-value pair.
    // The user entry is outermost and the file entry is innermost. The user 
    // entry is of the form `[ <email>, [ <file entry> ] ]`, and the 
    // file entry is of the form `[ <filename>, <user file line change count> ]`.
    // ```
    // [
    //   [ 'user1', [
    //     [ 'file1', 0 ],
    //     [ 'file2', 3 ]
    //     [ 'file3', 0]
    //   ]],
    //   [ 'user2', [
    //     [ 'file1', 12 ],
    //     [ 'file2',  0 ],
    //     [ 'file3',  3 ]
    //   ]],
    // ]
    // ```
    this.matrix = [];
    this.files = [];
    this.emails = [];
  }

  addCommit(commit/*: Commit */) {
    var commitFileNames, user, userFiles;
    this.emails = union(this.emails, [commit.email]);
    commitFileNames = commit.files.map((file) => {
      return file.name;
    });
    this.files = union(this.files, commitFileNames);
    this.reshapeMatrix();
    user = this.matrix.find((u) => {
      return u[0] === commit.email;
    });
    if (!user) {
      throw new Error('Matrix did not container user');
    }
    userFiles = user[1];
    return userFiles.forEach((userFile) => {
      var commitFile;
      commitFile = commit.files.find((file) => {
        return file.name === userFile[0];
      });
      if (commitFile) {
        return userFile[1] += commitFile.added + commitFile.deleted;
      }
    });
  }

  // Ensure that we have an entry in the matrix for every email in `@emails`,
  // and ensure that every user has an entry for every file in `@files`.
  reshapeMatrix() {
    var currentEmails, newEmails;
    currentEmails = this.matrix.map((user) => {
      return user[0];
    });
    newEmails = difference(this.emails, currentEmails);
    newEmails.forEach((email) => {
      return this.matrix.push([email, []]);
    });
    return this.matrix.forEach((user) => {
      var currentFiles, files, newFiles;
      files = user[1];
      currentFiles = files.map((file) => {
        return file[0];
      });
      newFiles = difference(this.files, currentFiles);
      return newFiles.forEach((file) => {
        return files.push([file, 0]);
      });
    });
  }

  sort() {
    this.files = this.files.sort();
    this.emails = this.emails.sort();
    this.matrix = sortBy(this.matrix, (user) => {
      return user[0];
    });
    return this.matrix = this.matrix.map((user) => {
      return [
        user[0],
        sortBy(user[1],
        (file) => {
          return file[0];
        })
      ];
    });
  }

};

module.exports = UserFileChangeCountMatrix;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlckZpbGVDaGFuZ2VDb3VudE1hdHJpeC5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsic3JjL1VzZXJGaWxlQ2hhbmdlQ291bnRNYXRyaXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsSUFBQSx5QkFBQSxFQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxVQUFULEVBQXFCLE1BQXJCLENBQUEsR0FBZ0MsT0FBQSxDQUFRLFFBQVIsQ0FBaEM7O0FBRU0sNEJBQU4sTUFBQSwwQkFBQSxDQUFBOzs7Ozs7RUFPRSxXQUFhLENBQUEsQ0FBQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JYLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQXhCQzs7RUEwQmIsU0FBVyxDQUFDLG1CQUFELENBQUE7QUFDVCxRQUFBLGVBQUEsRUFBQSxJQUFBLEVBQUE7SUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBQUEsQ0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLENBQUMsTUFBTSxDQUFDLEtBQVIsQ0FBZjtJQUNWLGVBQUEsR0FBa0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFiLENBQWlCLENBQUMsSUFBRCxDQUFBLEdBQUE7YUFBVSxJQUFJLENBQUM7SUFBZixDQUFqQjtJQUNsQixJQUFDLENBQUEsS0FBRCxHQUFTLEtBQUEsQ0FBTSxJQUFDLENBQUEsS0FBUCxFQUFjLGVBQWQ7SUFDVCxJQUFDLENBQUEsYUFBRCxDQUFBO0lBQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLENBQUMsQ0FBRCxDQUFBLEdBQUE7YUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsTUFBTSxDQUFDO0lBQXRCLENBQWI7SUFDUCxJQUFtRCxDQUFDLElBQXBEO01BQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSwrQkFBVixFQUFOOztJQUNBLFNBQUEsR0FBWSxJQUFLLENBQUEsQ0FBQTtXQUNqQixTQUFTLENBQUMsT0FBVixDQUFrQixDQUFDLFFBQUQsQ0FBQSxHQUFBO0FBQ2hCLFVBQUE7TUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLENBQUMsSUFBRCxDQUFBLEdBQUE7ZUFBVSxJQUFJLENBQUMsSUFBTCxLQUFhLFFBQVMsQ0FBQSxDQUFBO01BQWhDLENBQWxCO01BQ2IsSUFBRyxVQUFIO2VBQ0UsUUFBUyxDQUFBLENBQUEsQ0FBVCxJQUFlLFVBQVUsQ0FBQyxLQUFYLEdBQW1CLFVBQVUsQ0FBQyxRQUQvQzs7SUFGZ0IsQ0FBbEI7RUFSUyxDQTFCWDs7OztFQXlDQSxhQUFlLENBQUEsQ0FBQTtBQUNiLFFBQUEsYUFBQSxFQUFBO0lBQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxDQUFDLElBQUQsQ0FBQSxHQUFBO2FBQVUsSUFBSyxDQUFBLENBQUE7SUFBZixDQUFaO0lBQ2hCLFNBQUEsR0FBWSxVQUFBLENBQVcsSUFBQyxDQUFBLE1BQVosRUFBb0IsYUFBcEI7SUFDWixTQUFTLENBQUMsT0FBVixDQUFrQixDQUFDLEtBQUQsQ0FBQSxHQUFBO2FBQ2hCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLENBQUUsS0FBRixFQUFTLEVBQVQsQ0FBYjtJQURnQixDQUFsQjtXQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixDQUFDLElBQUQsQ0FBQSxHQUFBO0FBQ2QsVUFBQSxZQUFBLEVBQUEsS0FBQSxFQUFBO01BQUEsS0FBQSxHQUFRLElBQUssQ0FBQSxDQUFBO01BQ2IsWUFBQSxHQUFlLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBQyxJQUFELENBQUEsR0FBQTtlQUFVLElBQUssQ0FBQSxDQUFBO01BQWYsQ0FBVjtNQUNmLFFBQUEsR0FBVyxVQUFBLENBQVcsSUFBQyxDQUFBLEtBQVosRUFBbUIsWUFBbkI7YUFDWCxRQUFRLENBQUMsT0FBVCxDQUFpQixDQUFDLElBQUQsQ0FBQSxHQUFBO2VBQ2YsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFFLElBQUYsRUFBUSxDQUFSLENBQVg7TUFEZSxDQUFqQjtJQUpjLENBQWhCO0VBTGE7O0VBWWYsSUFBTSxDQUFBLENBQUE7SUFDSixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO0lBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBQTtJQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBQSxDQUFPLElBQUMsQ0FBQSxNQUFSLEVBQWdCLENBQUMsSUFBRCxDQUFBLEdBQUE7YUFBVSxJQUFLLENBQUEsQ0FBQTtJQUFmLENBQWhCO1dBQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxDQUFDLElBQUQsQ0FBQSxHQUFBO2FBQ3BCO1FBQ0UsSUFBSyxDQUFBLENBQUEsQ0FEUDtRQUVFLE1BQUEsQ0FBTyxJQUFLLENBQUEsQ0FBQSxDQUFaO1FBQWdCLENBQUMsSUFBRCxDQUFBLEdBQUE7aUJBQVUsSUFBSyxDQUFBLENBQUE7UUFBZixDQUFoQixDQUZGOztJQURvQixDQUFaO0VBSk47O0FBNURSOztBQXNFQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgQGZsb3dcblxueyB1bmlvbiwgZGlmZmVyZW5jZSwgc29ydEJ5IH0gPSByZXF1aXJlICcuL3V0aWwnXG5cbmNsYXNzIFVzZXJGaWxlQ2hhbmdlQ291bnRNYXRyaXhcbiAgIyMjOjpcbiAgbWF0cml4OiBBcnJheTxbc3RyaW5nLCBBcnJheTxbc3RyaW5nLCBudW1iZXJdPl0+XG4gIGZpbGVzOiBBcnJheTxzdHJpbmc+XG4gIGVtYWlsczogQXJyYXk8c3RyaW5nPlxuICAjIyNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIFRoZSBtYXRyaXggaXMgYSB0YWJsZSB3aXRoIHVzZXJzIGFsb25nIG9uZSBheGlzIGFuZCBmaWxlcyBhbG9uZyB0aGUgb3RoZXJcbiAgICAjIGF4aXMsIGFuZCB0aGUgbnVtYmVyIG9mIGNoYW5nZWQgbGluZXMgYSB1c2VyIGhhcyBmb3IgYSBmaWxlIGFzIHRoZSBjZWxsLlxuICAgICMgV2Ugc3RvcmUgdGhlIG1hdHJpeCBpbnRlcm5hbGx5IGFzIGEgMi1kaW1lbnNpb25hbCBhcnJheSBvZiBzaXplIFxuICAgICMgYDxudW0gdXNlcnM+IHggPG51bSBmaWxlcz5gLCBhbmQgd2hlcmUgZWFjaCBlbnRyeSBpcyBhIGtleS12YWx1ZSBwYWlyLlxuICAgICMgVGhlIHVzZXIgZW50cnkgaXMgb3V0ZXJtb3N0IGFuZCB0aGUgZmlsZSBlbnRyeSBpcyBpbm5lcm1vc3QuIFRoZSB1c2VyIFxuICAgICMgZW50cnkgaXMgb2YgdGhlIGZvcm0gYFsgPGVtYWlsPiwgWyA8ZmlsZSBlbnRyeT4gXSBdYCwgYW5kIHRoZSBcbiAgICAjIGZpbGUgZW50cnkgaXMgb2YgdGhlIGZvcm0gYFsgPGZpbGVuYW1lPiwgPHVzZXIgZmlsZSBsaW5lIGNoYW5nZSBjb3VudD4gXWAuXG4gICAgIyBgYGBcbiAgICAjIFtcbiAgICAjICAgWyAndXNlcjEnLCBbXG4gICAgIyAgICAgWyAnZmlsZTEnLCAwIF0sXG4gICAgIyAgICAgWyAnZmlsZTInLCAzIF1cbiAgICAjICAgICBbICdmaWxlMycsIDBdXG4gICAgIyAgIF1dLFxuICAgICMgICBbICd1c2VyMicsIFtcbiAgICAjICAgICBbICdmaWxlMScsIDEyIF0sXG4gICAgIyAgICAgWyAnZmlsZTInLCAgMCBdLFxuICAgICMgICAgIFsgJ2ZpbGUzJywgIDMgXVxuICAgICMgICBdXSxcbiAgICAjIF1cbiAgICAjIGBgYFxuICAgIEBtYXRyaXggPSBbXVxuICAgIEBmaWxlcyA9IFtdXG4gICAgQGVtYWlscyA9IFtdXG4gIFxuICBhZGRDb21taXQ6IChjb21taXQgIyMjOiBDb21taXQgIyMjKSAtPlxuICAgIEBlbWFpbHMgPSB1bmlvbiBAZW1haWxzLCBbY29tbWl0LmVtYWlsXVxuICAgIGNvbW1pdEZpbGVOYW1lcyA9IGNvbW1pdC5maWxlcy5tYXAgKGZpbGUpID0+IGZpbGUubmFtZVxuICAgIEBmaWxlcyA9IHVuaW9uIEBmaWxlcywgY29tbWl0RmlsZU5hbWVzXG4gICAgQHJlc2hhcGVNYXRyaXgoKVxuICAgIHVzZXIgPSBAbWF0cml4LmZpbmQgKHUpID0+IHVbMF0gPT0gY29tbWl0LmVtYWlsXG4gICAgdGhyb3cgbmV3IEVycm9yICdNYXRyaXggZGlkIG5vdCBjb250YWluZXIgdXNlcicgaWYgIXVzZXJcbiAgICB1c2VyRmlsZXMgPSB1c2VyWzFdXG4gICAgdXNlckZpbGVzLmZvckVhY2ggKHVzZXJGaWxlKSA9PlxuICAgICAgY29tbWl0RmlsZSA9IGNvbW1pdC5maWxlcy5maW5kIChmaWxlKSA9PiBmaWxlLm5hbWUgPT0gdXNlckZpbGVbMF1cbiAgICAgIGlmIGNvbW1pdEZpbGVcbiAgICAgICAgdXNlckZpbGVbMV0gKz0gY29tbWl0RmlsZS5hZGRlZCArIGNvbW1pdEZpbGUuZGVsZXRlZFxuXG4gICMgRW5zdXJlIHRoYXQgd2UgaGF2ZSBhbiBlbnRyeSBpbiB0aGUgbWF0cml4IGZvciBldmVyeSBlbWFpbCBpbiBgQGVtYWlsc2AsXG4gICMgYW5kIGVuc3VyZSB0aGF0IGV2ZXJ5IHVzZXIgaGFzIGFuIGVudHJ5IGZvciBldmVyeSBmaWxlIGluIGBAZmlsZXNgLlxuICByZXNoYXBlTWF0cml4OiAoKSAtPlxuICAgIGN1cnJlbnRFbWFpbHMgPSBAbWF0cml4Lm1hcCAodXNlcikgPT4gdXNlclswXVxuICAgIG5ld0VtYWlscyA9IGRpZmZlcmVuY2UgQGVtYWlscywgY3VycmVudEVtYWlsc1xuICAgIG5ld0VtYWlscy5mb3JFYWNoIChlbWFpbCkgPT4gXG4gICAgICBAbWF0cml4LnB1c2ggWyBlbWFpbCwgW10gXVxuICAgIEBtYXRyaXguZm9yRWFjaCAodXNlcikgPT5cbiAgICAgIGZpbGVzID0gdXNlclsxXVxuICAgICAgY3VycmVudEZpbGVzID0gZmlsZXMubWFwIChmaWxlKSA9PiBmaWxlWzBdXG4gICAgICBuZXdGaWxlcyA9IGRpZmZlcmVuY2UgQGZpbGVzLCBjdXJyZW50RmlsZXNcbiAgICAgIG5ld0ZpbGVzLmZvckVhY2ggKGZpbGUpID0+XG4gICAgICAgIGZpbGVzLnB1c2ggWyBmaWxlLCAwIF1cblxuICBzb3J0OiAoKSAtPlxuICAgIEBmaWxlcyA9IEBmaWxlcy5zb3J0KClcbiAgICBAZW1haWxzID0gQGVtYWlscy5zb3J0KClcbiAgICBAbWF0cml4ID0gc29ydEJ5IEBtYXRyaXgsICh1c2VyKSA9PiB1c2VyWzBdXG4gICAgQG1hdHJpeCA9IEBtYXRyaXgubWFwICh1c2VyKSA9PlxuICAgICAgW1xuICAgICAgICB1c2VyWzBdLFxuICAgICAgICBzb3J0QnkgdXNlclsxXSwgKGZpbGUpID0+IGZpbGVbMF1cbiAgICAgIF1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyRmlsZUNoYW5nZUNvdW50TWF0cml4Il19
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/UserFileChangeCountMatrix.coffee