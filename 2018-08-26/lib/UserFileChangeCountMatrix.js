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
    this.addCommit = this.addCommit.bind(this);
    // Ensure that we have an entry in the matrix for every email in `@emails`,
    // and ensure that every user has an entry for every file in `@files`.
    this.reshapeMatrix = this.reshapeMatrix.bind(this);
    this.sort = this.sort.bind(this);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlckZpbGVDaGFuZ2VDb3VudE1hdHJpeC5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsic3JjL1VzZXJGaWxlQ2hhbmdlQ291bnRNYXRyaXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsSUFBQSx5QkFBQSxFQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsQ0FBQSxDQUFFLEtBQUYsRUFBUyxVQUFULEVBQXFCLE1BQXJCLENBQUEsR0FBZ0MsT0FBQSxDQUFRLFFBQVIsQ0FBaEM7O0FBRU0sNEJBQU4sTUFBQSwwQkFBQSxDQUFBOzs7Ozs7RUFPRSxXQUFhLENBQUEsQ0FBQTtRQTBCYixDQUFBLGdCQUFBLENBQUEscUJBSkU7OztRQW1CRixDQUFBLG9CQUFBLENBQUE7UUFZQSxDQUFBLFdBQUEsQ0FBQSxnQkEvQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxNQUFELEdBQVU7RUF4QkM7O0VBMEJiLFNBQVcsQ0FBQyxtQkFBRCxDQUFBO0FBQ1QsUUFBQSxlQUFBLEVBQUEsSUFBQSxFQUFBO0lBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQUFBLENBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFSLENBQWY7SUFDVixlQUFBLEdBQWtCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBYixDQUFpQixDQUFDLElBQUQsQ0FBQSxHQUFBO2FBQVUsSUFBSSxDQUFDO0lBQWYsQ0FBakI7SUFDbEIsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFBLENBQU0sSUFBQyxDQUFBLEtBQVAsRUFBYyxlQUFkO0lBQ1QsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxDQUFDLENBQUQsQ0FBQSxHQUFBO2FBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLE1BQU0sQ0FBQztJQUF0QixDQUFiO0lBQ1AsSUFBbUQsQ0FBQyxJQUFwRDtNQUFBLE1BQU0sSUFBSSxLQUFKLENBQVUsK0JBQVYsRUFBTjs7SUFDQSxTQUFBLEdBQVksSUFBSyxDQUFBLENBQUE7V0FDakIsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsQ0FBQyxRQUFELENBQUEsR0FBQTtBQUNoQixVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBYixDQUFrQixDQUFDLElBQUQsQ0FBQSxHQUFBO2VBQVUsSUFBSSxDQUFDLElBQUwsS0FBYSxRQUFTLENBQUEsQ0FBQTtNQUFoQyxDQUFsQjtNQUNiLElBQUcsVUFBSDtlQUNFLFFBQVMsQ0FBQSxDQUFBLENBQVQsSUFBZSxVQUFVLENBQUMsS0FBWCxHQUFtQixVQUFVLENBQUMsUUFEL0M7O0lBRmdCLENBQWxCO0VBUlM7O0VBZVgsYUFBZSxDQUFBLENBQUE7QUFDYixRQUFBLGFBQUEsRUFBQTtJQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksQ0FBQyxJQUFELENBQUEsR0FBQTthQUFVLElBQUssQ0FBQSxDQUFBO0lBQWYsQ0FBWjtJQUNoQixTQUFBLEdBQVksVUFBQSxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBQW9CLGFBQXBCO0lBQ1osU0FBUyxDQUFDLE9BQVYsQ0FBa0IsQ0FBQyxLQUFELENBQUEsR0FBQTthQUNoQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxDQUFFLEtBQUYsRUFBUyxFQUFULENBQWI7SUFEZ0IsQ0FBbEI7V0FFQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxJQUFELENBQUEsR0FBQTtBQUNkLFVBQUEsWUFBQSxFQUFBLEtBQUEsRUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFLLENBQUEsQ0FBQTtNQUNiLFlBQUEsR0FBZSxLQUFLLENBQUMsR0FBTixDQUFVLENBQUMsSUFBRCxDQUFBLEdBQUE7ZUFBVSxJQUFLLENBQUEsQ0FBQTtNQUFmLENBQVY7TUFDZixRQUFBLEdBQVcsVUFBQSxDQUFXLElBQUMsQ0FBQSxLQUFaLEVBQW1CLFlBQW5CO2FBQ1gsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBQyxJQUFELENBQUEsR0FBQTtlQUNmLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBRSxJQUFGLEVBQVEsQ0FBUixDQUFYO01BRGUsQ0FBakI7SUFKYyxDQUFoQjtFQUxhOztFQVlmLElBQU0sQ0FBQSxDQUFBO0lBQ0osSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtJQUNULElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQUE7SUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLE1BQUEsQ0FBTyxJQUFDLENBQUEsTUFBUixFQUFnQixDQUFDLElBQUQsQ0FBQSxHQUFBO2FBQVUsSUFBSyxDQUFBLENBQUE7SUFBZixDQUFoQjtXQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksQ0FBQyxJQUFELENBQUEsR0FBQTthQUNwQjtRQUNFLElBQUssQ0FBQSxDQUFBLENBRFA7UUFFRSxNQUFBLENBQU8sSUFBSyxDQUFBLENBQUEsQ0FBWjtRQUFnQixDQUFDLElBQUQsQ0FBQSxHQUFBO2lCQUFVLElBQUssQ0FBQSxDQUFBO1FBQWYsQ0FBaEIsQ0FGRjs7SUFEb0IsQ0FBWjtFQUpOOztBQTVEUjs7QUFzRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIEBmbG93XG5cbnsgdW5pb24sIGRpZmZlcmVuY2UsIHNvcnRCeSB9ID0gcmVxdWlyZSAnLi91dGlsJ1xuXG5jbGFzcyBVc2VyRmlsZUNoYW5nZUNvdW50TWF0cml4XG4gICMjIzo6XG4gIG1hdHJpeDogQXJyYXk8W3N0cmluZywgQXJyYXk8W3N0cmluZywgbnVtYmVyXT5dPlxuICBmaWxlczogQXJyYXk8c3RyaW5nPlxuICBlbWFpbHM6IEFycmF5PHN0cmluZz5cbiAgIyMjXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgIyBUaGUgbWF0cml4IGlzIGEgdGFibGUgd2l0aCB1c2VycyBhbG9uZyBvbmUgYXhpcyBhbmQgZmlsZXMgYWxvbmcgdGhlIG90aGVyXG4gICAgIyBheGlzLCBhbmQgdGhlIG51bWJlciBvZiBjaGFuZ2VkIGxpbmVzIGEgdXNlciBoYXMgZm9yIGEgZmlsZSBhcyB0aGUgY2VsbC5cbiAgICAjIFdlIHN0b3JlIHRoZSBtYXRyaXggaW50ZXJuYWxseSBhcyBhIDItZGltZW5zaW9uYWwgYXJyYXkgb2Ygc2l6ZSBcbiAgICAjIGA8bnVtIHVzZXJzPiB4IDxudW0gZmlsZXM+YCwgYW5kIHdoZXJlIGVhY2ggZW50cnkgaXMgYSBrZXktdmFsdWUgcGFpci5cbiAgICAjIFRoZSB1c2VyIGVudHJ5IGlzIG91dGVybW9zdCBhbmQgdGhlIGZpbGUgZW50cnkgaXMgaW5uZXJtb3N0LiBUaGUgdXNlciBcbiAgICAjIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxlbWFpbD4sIFsgPGZpbGUgZW50cnk+IF0gXWAsIGFuZCB0aGUgXG4gICAgIyBmaWxlIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxmaWxlbmFtZT4sIDx1c2VyIGZpbGUgbGluZSBjaGFuZ2UgY291bnQ+IF1gLlxuICAgICMgYGBgXG4gICAgIyBbXG4gICAgIyAgIFsgJ3VzZXIxJywgW1xuICAgICMgICAgIFsgJ2ZpbGUxJywgMCBdLFxuICAgICMgICAgIFsgJ2ZpbGUyJywgMyBdXG4gICAgIyAgICAgWyAnZmlsZTMnLCAwXVxuICAgICMgICBdXSxcbiAgICAjICAgWyAndXNlcjInLCBbXG4gICAgIyAgICAgWyAnZmlsZTEnLCAxMiBdLFxuICAgICMgICAgIFsgJ2ZpbGUyJywgIDAgXSxcbiAgICAjICAgICBbICdmaWxlMycsICAzIF1cbiAgICAjICAgXV0sXG4gICAgIyBdXG4gICAgIyBgYGBcbiAgICBAbWF0cml4ID0gW11cbiAgICBAZmlsZXMgPSBbXVxuICAgIEBlbWFpbHMgPSBbXVxuICBcbiAgYWRkQ29tbWl0OiAoY29tbWl0ICMjIzogQ29tbWl0ICMjIykgPT5cbiAgICBAZW1haWxzID0gdW5pb24gQGVtYWlscywgW2NvbW1pdC5lbWFpbF1cbiAgICBjb21taXRGaWxlTmFtZXMgPSBjb21taXQuZmlsZXMubWFwIChmaWxlKSA9PiBmaWxlLm5hbWVcbiAgICBAZmlsZXMgPSB1bmlvbiBAZmlsZXMsIGNvbW1pdEZpbGVOYW1lc1xuICAgIEByZXNoYXBlTWF0cml4KClcbiAgICB1c2VyID0gQG1hdHJpeC5maW5kICh1KSA9PiB1WzBdID09IGNvbW1pdC5lbWFpbFxuICAgIHRocm93IG5ldyBFcnJvciAnTWF0cml4IGRpZCBub3QgY29udGFpbmVyIHVzZXInIGlmICF1c2VyXG4gICAgdXNlckZpbGVzID0gdXNlclsxXVxuICAgIHVzZXJGaWxlcy5mb3JFYWNoICh1c2VyRmlsZSkgPT5cbiAgICAgIGNvbW1pdEZpbGUgPSBjb21taXQuZmlsZXMuZmluZCAoZmlsZSkgPT4gZmlsZS5uYW1lID09IHVzZXJGaWxlWzBdXG4gICAgICBpZiBjb21taXRGaWxlXG4gICAgICAgIHVzZXJGaWxlWzFdICs9IGNvbW1pdEZpbGUuYWRkZWQgKyBjb21taXRGaWxlLmRlbGV0ZWRcblxuICAjIEVuc3VyZSB0aGF0IHdlIGhhdmUgYW4gZW50cnkgaW4gdGhlIG1hdHJpeCBmb3IgZXZlcnkgZW1haWwgaW4gYEBlbWFpbHNgLFxuICAjIGFuZCBlbnN1cmUgdGhhdCBldmVyeSB1c2VyIGhhcyBhbiBlbnRyeSBmb3IgZXZlcnkgZmlsZSBpbiBgQGZpbGVzYC5cbiAgcmVzaGFwZU1hdHJpeDogKCkgPT5cbiAgICBjdXJyZW50RW1haWxzID0gQG1hdHJpeC5tYXAgKHVzZXIpID0+IHVzZXJbMF1cbiAgICBuZXdFbWFpbHMgPSBkaWZmZXJlbmNlIEBlbWFpbHMsIGN1cnJlbnRFbWFpbHNcbiAgICBuZXdFbWFpbHMuZm9yRWFjaCAoZW1haWwpID0+IFxuICAgICAgQG1hdHJpeC5wdXNoIFsgZW1haWwsIFtdIF1cbiAgICBAbWF0cml4LmZvckVhY2ggKHVzZXIpID0+XG4gICAgICBmaWxlcyA9IHVzZXJbMV1cbiAgICAgIGN1cnJlbnRGaWxlcyA9IGZpbGVzLm1hcCAoZmlsZSkgPT4gZmlsZVswXVxuICAgICAgbmV3RmlsZXMgPSBkaWZmZXJlbmNlIEBmaWxlcywgY3VycmVudEZpbGVzXG4gICAgICBuZXdGaWxlcy5mb3JFYWNoIChmaWxlKSA9PlxuICAgICAgICBmaWxlcy5wdXNoIFsgZmlsZSwgMCBdXG5cbiAgc29ydDogKCkgPT5cbiAgICBAZmlsZXMgPSBAZmlsZXMuc29ydCgpXG4gICAgQGVtYWlscyA9IEBlbWFpbHMuc29ydCgpXG4gICAgQG1hdHJpeCA9IHNvcnRCeSBAbWF0cml4LCAodXNlcikgPT4gdXNlclswXVxuICAgIEBtYXRyaXggPSBAbWF0cml4Lm1hcCAodXNlcikgPT5cbiAgICAgIFtcbiAgICAgICAgdXNlclswXSxcbiAgICAgICAgc29ydEJ5IHVzZXJbMV0sIChmaWxlKSA9PiBmaWxlWzBdXG4gICAgICBdXG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckZpbGVDaGFuZ2VDb3VudE1hdHJpeCJdfQ==
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/UserFileChangeCountMatrix.coffee