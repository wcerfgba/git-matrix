// @flow
var UserFileCommitCountMatrix;

UserFileCommitCountMatrix = class UserFileCommitCountMatrix {
  /*::
  matrix: Array<[string, Array<[string, number]>]>
  files: Array<string>
  emails: Array<string>
  */
  constructor() {
    // The matrix is a table with users along one axis and files along the other
    // axis, and the number of commits a user has for a file as the cell. We 
    // store the matrix internally as a 2-dimensional array of size 
    // `<num users> x <num files>`, and where each entry is a key-value pair.
    // The user entry is outermost and the file entry is innermost. The user 
    // entry is of the form `[ <email>, [ <file entry> ] ]`, and the 
    // file entry is of the form `[ <filename>, <user file commit count> ]`.
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

  addCommit(commit) {
    var files, user;
    this.emails = union(this.emails, [commit.email]);
    this.files = union(this.files, commit.files);
    this.reshapeMatrix();
    user = this.matrix.find((u) => {
      return u[0] === commit.email;
    });
    if (!user) {
      throw new Error('Matrix did not container user');
    }
    files = user[1];
    return files.forEach((file) => {
      if (commit.files.includes(file[0])) {
        return file[1] += 1;
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

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlckZpbGVDb21taXRDb3VudE1hdHJpeC5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsic3JjL1VzZXJGaWxlQ29tbWl0Q291bnRNYXRyaXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsSUFBQTs7QUFFTSw0QkFBTixNQUFBLDBCQUFBLENBQUE7Ozs7OztFQU9FLFdBQWEsQ0FBQSxDQUFBLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQlgsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVO0VBeEJDOztFQTBCYixTQUFXLENBQUMsTUFBRCxDQUFBO0FBQ1QsUUFBQSxLQUFBLEVBQUE7SUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBQUEsQ0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLENBQUMsTUFBTSxDQUFDLEtBQVIsQ0FBZjtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQSxDQUFNLElBQUMsQ0FBQSxLQUFQLEVBQWMsTUFBTSxDQUFDLEtBQXJCO0lBQ1QsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxDQUFDLENBQUQsQ0FBQSxHQUFBO2FBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLE1BQU0sQ0FBQztJQUF0QixDQUFiO0lBQ1AsSUFBbUQsQ0FBQyxJQUFwRDtNQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsK0JBQVYsRUFBTjs7SUFDQSxLQUFBLEdBQVEsSUFBSyxDQUFBLENBQUE7V0FDYixLQUFLLENBQUMsT0FBTixDQUFjLENBQUMsSUFBRCxDQUFBLEdBQUE7TUFDWixJQUFnQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQWIsQ0FBc0IsSUFBSyxDQUFBLENBQUEsQ0FBM0IsQ0FBaEI7ZUFBQSxJQUFLLENBQUEsQ0FBQSxDQUFMLElBQVcsRUFBWDs7SUFEWSxDQUFkO0VBUFMsQ0ExQlg7Ozs7RUFzQ0EsYUFBZSxDQUFBLENBQUE7QUFDYixRQUFBLGFBQUEsRUFBQTtJQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksQ0FBQyxJQUFELENBQUEsR0FBQTthQUFVLElBQUssQ0FBQSxDQUFBO0lBQWYsQ0FBWjtJQUNoQixTQUFBLEdBQVksVUFBQSxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBQW9CLGFBQXBCO0lBQ1osU0FBUyxDQUFDLE9BQVYsQ0FBa0IsQ0FBQyxLQUFELENBQUEsR0FBQTthQUNoQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxDQUFFLEtBQUYsRUFBUyxFQUFULENBQWI7SUFEZ0IsQ0FBbEI7V0FFQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxJQUFELENBQUEsR0FBQTtBQUNkLFVBQUEsWUFBQSxFQUFBLEtBQUEsRUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFLLENBQUEsQ0FBQTtNQUNiLFlBQUEsR0FBZSxLQUFLLENBQUMsR0FBTixDQUFVLENBQUMsSUFBRCxDQUFBLEdBQUE7ZUFBVSxJQUFLLENBQUEsQ0FBQTtNQUFmLENBQVY7TUFDZixRQUFBLEdBQVcsVUFBQSxDQUFXLElBQUMsQ0FBQSxLQUFaLEVBQW1CLFlBQW5CO2FBQ1gsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBQyxJQUFELENBQUEsR0FBQTtlQUNmLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBRSxJQUFGLEVBQVEsQ0FBUixDQUFYO01BRGUsQ0FBakI7SUFKYyxDQUFoQjtFQUxhOztBQTdDakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIEBmbG93XG5cbmNsYXNzIFVzZXJGaWxlQ29tbWl0Q291bnRNYXRyaXhcbiAgIyMjOjpcbiAgbWF0cml4OiBBcnJheTxbc3RyaW5nLCBBcnJheTxbc3RyaW5nLCBudW1iZXJdPl0+XG4gIGZpbGVzOiBBcnJheTxzdHJpbmc+XG4gIGVtYWlsczogQXJyYXk8c3RyaW5nPlxuICAjIyNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIFRoZSBtYXRyaXggaXMgYSB0YWJsZSB3aXRoIHVzZXJzIGFsb25nIG9uZSBheGlzIGFuZCBmaWxlcyBhbG9uZyB0aGUgb3RoZXJcbiAgICAjIGF4aXMsIGFuZCB0aGUgbnVtYmVyIG9mIGNvbW1pdHMgYSB1c2VyIGhhcyBmb3IgYSBmaWxlIGFzIHRoZSBjZWxsLiBXZSBcbiAgICAjIHN0b3JlIHRoZSBtYXRyaXggaW50ZXJuYWxseSBhcyBhIDItZGltZW5zaW9uYWwgYXJyYXkgb2Ygc2l6ZSBcbiAgICAjIGA8bnVtIHVzZXJzPiB4IDxudW0gZmlsZXM+YCwgYW5kIHdoZXJlIGVhY2ggZW50cnkgaXMgYSBrZXktdmFsdWUgcGFpci5cbiAgICAjIFRoZSB1c2VyIGVudHJ5IGlzIG91dGVybW9zdCBhbmQgdGhlIGZpbGUgZW50cnkgaXMgaW5uZXJtb3N0LiBUaGUgdXNlciBcbiAgICAjIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxlbWFpbD4sIFsgPGZpbGUgZW50cnk+IF0gXWAsIGFuZCB0aGUgXG4gICAgIyBmaWxlIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxmaWxlbmFtZT4sIDx1c2VyIGZpbGUgY29tbWl0IGNvdW50PiBdYC5cbiAgICAjIGBgYFxuICAgICMgW1xuICAgICMgICBbICd1c2VyMScsIFtcbiAgICAjICAgICBbICdmaWxlMScsIDAgXSxcbiAgICAjICAgICBbICdmaWxlMicsIDMgXVxuICAgICMgICAgIFsgJ2ZpbGUzJywgMF1cbiAgICAjICAgXV0sXG4gICAgIyAgIFsgJ3VzZXIyJywgW1xuICAgICMgICAgIFsgJ2ZpbGUxJywgMTIgXSxcbiAgICAjICAgICBbICdmaWxlMicsICAwIF0sXG4gICAgIyAgICAgWyAnZmlsZTMnLCAgMyBdXG4gICAgIyAgIF1dLFxuICAgICMgXVxuICAgICMgYGBgXG4gICAgQG1hdHJpeCA9IFtdXG4gICAgQGZpbGVzID0gW11cbiAgICBAZW1haWxzID0gW11cbiAgXG4gIGFkZENvbW1pdDogKGNvbW1pdCkgLT5cbiAgICBAZW1haWxzID0gdW5pb24gQGVtYWlscywgW2NvbW1pdC5lbWFpbF1cbiAgICBAZmlsZXMgPSB1bmlvbiBAZmlsZXMsIGNvbW1pdC5maWxlc1xuICAgIEByZXNoYXBlTWF0cml4KClcbiAgICB1c2VyID0gQG1hdHJpeC5maW5kICh1KSA9PiB1WzBdID09IGNvbW1pdC5lbWFpbFxuICAgIHRocm93IG5ldyBFcnJvciAnTWF0cml4IGRpZCBub3QgY29udGFpbmVyIHVzZXInIGlmICF1c2VyXG4gICAgZmlsZXMgPSB1c2VyWzFdXG4gICAgZmlsZXMuZm9yRWFjaCAoZmlsZSkgPT5cbiAgICAgIGZpbGVbMV0gKz0gMSBpZiBjb21taXQuZmlsZXMuaW5jbHVkZXMgZmlsZVswXVxuXG4gICMgRW5zdXJlIHRoYXQgd2UgaGF2ZSBhbiBlbnRyeSBpbiB0aGUgbWF0cml4IGZvciBldmVyeSBlbWFpbCBpbiBgQGVtYWlsc2AsXG4gICMgYW5kIGVuc3VyZSB0aGF0IGV2ZXJ5IHVzZXIgaGFzIGFuIGVudHJ5IGZvciBldmVyeSBmaWxlIGluIGBAZmlsZXNgLlxuICByZXNoYXBlTWF0cml4OiAoKSAtPlxuICAgIGN1cnJlbnRFbWFpbHMgPSBAbWF0cml4Lm1hcCAodXNlcikgPT4gdXNlclswXVxuICAgIG5ld0VtYWlscyA9IGRpZmZlcmVuY2UgQGVtYWlscywgY3VycmVudEVtYWlsc1xuICAgIG5ld0VtYWlscy5mb3JFYWNoIChlbWFpbCkgPT4gXG4gICAgICBAbWF0cml4LnB1c2ggWyBlbWFpbCwgW10gXVxuICAgIEBtYXRyaXguZm9yRWFjaCAodXNlcikgPT5cbiAgICAgIGZpbGVzID0gdXNlclsxXVxuICAgICAgY3VycmVudEZpbGVzID0gZmlsZXMubWFwIChmaWxlKSA9PiBmaWxlWzBdXG4gICAgICBuZXdGaWxlcyA9IGRpZmZlcmVuY2UgQGZpbGVzLCBjdXJyZW50RmlsZXNcbiAgICAgIG5ld0ZpbGVzLmZvckVhY2ggKGZpbGUpID0+XG4gICAgICAgIGZpbGVzLnB1c2ggWyBmaWxlLCAwIF0iXX0=
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/UserFileCommitCountMatrix.coffee