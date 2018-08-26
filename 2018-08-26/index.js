// @flow
/*::
type Commit = {
time: number,
email: string,
files: Array<{
  name: string,
  added: number,
  deleted: number
}>
}
*/
var ChangesObjectStream, Transform, UserFileChangeCountMatrix, compact, debug, difference, inspect, isEmpty, last, main, matchCommitHeader, parseCommitChanges, spawn, trim, union;

({Transform} = require('stream'));

({spawn} = require('child_process'));

({compact, last, difference, isEmpty, trim, union} = require('lodash'));

({inspect} = require('util'));

debug = (...xs) => {
  return console.debug(inspect(xs, {
    depth: null
  }));
};

matchCommitHeader = (str)/*: ?Commit */ => {
  var matches;
  matches = str.match(/^(\d+) (.*@.*)$/);
  if (!matches) {
    return null;
  }
  return {
    time: Number(matches[1]),
    email: matches[2],
    files: []
  };
};

parseCommitChanges = (lines) => {
  return lines.map((line) => {
    var parts;
    parts = line.split('\t');
    return {
      added: Number(parts[0]),
      deleted: Number(parts[1]),
      name: parts[2]
    };
  });
};

ChangesObjectStream = class ChangesObjectStream extends Transform {
  /*::
  lastCommit: ?Commit
  */
  constructor() {
    super({
      objectMode: true
    });
    this.lastCommit = null;
  }

  _transform(chunk/*: Buffer | string */)/*: void */ {
    var commitObjects, rawCommits;
    chunk = chunk.toString();
    rawCommits = chunk.split('\n\n\n');
    rawCommits = compact(rawCommits);
    rawCommits = rawCommits.map(trim);
    commitObjects = rawCommits.reduce((commits, raw) => {
      var changedFiles, commit, lines;
      lines = compact(raw.split('\n'));
      commit = matchCommitHeader(lines[0]);
      if (commit) {
        commit.files = parseCommitChanges(lines.slice(1));
        this.lastCommit = commit;
        return [...commits, commit];
      }
      commit = this.lastCommit;
      if (commit === null) {
        throw new Error('Stream must begin at start of a commit');
      }
      changedFiles = parseCommitChanges(lines);
      changedFiles.forEach((changedFile) => {
        var existingFile;
        existingFile = commit.files.find((file) => {
          return file.name === changedFile.name;
        });
        if (existingFile) {
          existingFile.added += changedFile.added;
          return existingFile.deleted += changedFile.deleted;
        } else {
          return commit.files.push(changedFile);
        }
      });
      return commits;
    }, []);
    return commitObjects.forEach((commit) => {
      return this.push(commit);
    });
  }

};

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

  addCommit(commit) {
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

};

main = async() => {
  var changesObjectStream, changesProc, changesRawStream, end, matrix;
  changesProc = spawn('git', ['--no-pager', 'log', '--format=%n%n%ct %ae', '--numstat', '--no-merges', '--no-renames'], {
    env: {
      ...process.env,
      GIT_FLUSH: 0
    }
  });
  changesRawStream = changesProc.stdout;
  changesObjectStream = new ChangesObjectStream;
  changesRawStream.pipe(changesObjectStream);
  matrix = new UserFileChangeCountMatrix;
  end = new Promise((resolve, reject) => {
    changesObjectStream.on('data', (commit) => {
      return matrix.addCommit(commit);
    });
    return changesProc.on('exit', () => {
      debug(matrix);
      return resolve();
    });
  });
  return (await end);
};

main();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUFBLElBQUEsbUJBQUEsRUFBQSxTQUFBLEVBQUEseUJBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUE7O0FBRUEsQ0FBQSxDQUFFLFNBQUYsQ0FBQSxHQUFnQixPQUFBLENBQVEsUUFBUixDQUFoQjs7QUFDQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQVksT0FBQSxDQUFRLGVBQVIsQ0FBWjs7QUFDQSxDQUFBLENBQUUsT0FBRixFQUFXLElBQVgsRUFBaUIsVUFBakIsRUFBNkIsT0FBN0IsRUFBc0MsSUFBdEMsRUFBNEMsS0FBNUMsQ0FBQSxHQUFzRCxPQUFBLENBQVEsUUFBUixDQUF0RDs7QUFDQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQWMsT0FBQSxDQUFRLE1BQVIsQ0FBZDs7QUFJQSxLQUFBLEdBQVEsQ0FBQSxHQUFJLEVBQUosQ0FBQSxHQUFBO1NBQVcsT0FBTyxDQUFDLEtBQVIsQ0FBYyxPQUFBLENBQVEsRUFBUixFQUFZO0lBQUUsS0FBQSxFQUFPO0VBQVQsQ0FBWixDQUFkO0FBQVg7O0FBSVIsaUJBQUEsR0FBb0IsQ0FBQyxHQUFELGVBQUEsR0FBQTtBQUNsQixNQUFBO0VBQUEsT0FBQSxHQUFVLEdBQUcsQ0FBQyxLQUFKLENBQVUsaUJBQVY7RUFDVixJQUFlLENBQUMsT0FBaEI7QUFBQSxXQUFPLEtBQVA7O1NBQ0E7SUFDRSxJQUFBLEVBQU0sTUFBQSxDQUFPLE9BQVEsQ0FBQSxDQUFBLENBQWYsQ0FEUjtJQUVFLEtBQUEsRUFBTyxPQUFRLENBQUEsQ0FBQSxDQUZqQjtJQUdFLEtBQUEsRUFBTztFQUhUO0FBSGtCOztB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QUEsR0FBTSxJQUFJLE9BQUosQ0FBWSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQUEsR0FBQTtJQUNoQixtQkFBbUIsQ0FBQyxFQUFwQixDQUF1QixNQUF2QixFQUErQixDQUFDLE1BQUQsQ0FBQSxHQUFBO2FBQVksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBakI7SUFBWixDQUEvQjtXQUNBLFdBQVcsQ0FBQyxFQUFaLENBQWUsTUFBZixFQUF1QixDQUFBLENBQUEsR0FBQTtNQUNyQixLQUFBLENBQU0sTUFBTjthQUNBLE9BQUEsQ0FBQTtJQUZxQixDQUF2QjtFQUZnQixDQUFaO1NBTU4sQ0FBQSxNQUFNLEdBQU47QUFmSzs7QUFrQlAsSUFBQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyBAZmxvd1xuXG57IFRyYW5zZm9ybSB9ID0gcmVxdWlyZSAnc3RyZWFtJ1xueyBzcGF3biB9ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbnsgY29tcGFjdCwgbGFzdCwgZGlmZmVyZW5jZSwgaXNFbXB0eSwgdHJpbSwgdW5pb24gfSA9IHJlcXVpcmUgJ2xvZGFzaCdcbnsgaW5zcGVjdCB9ID0gcmVxdWlyZSAndXRpbCdcblxuXG5cbmRlYnVnID0gKC4uLnhzKSA9PiBjb25zb2xlLmRlYnVnIGluc3BlY3QgeHMsIHsgZGVwdGg6IG51bGwgfVxuXG5cblxubWF0Y2hDb21taXRIZWFkZXIgPSAoc3RyKSAjIyM6ID9Db21taXQgIyMjID0+XG4gIG1hdGNoZXMgPSBzdHIubWF0Y2goL14oXFxkKykgKC4qQC4qKSQvKVxuICByZXR1cm4gbnVsbCBpZiAhbWF0Y2hlc1xuICB7XG4gICAgdGltZTogTnVtYmVyIG1hdGNoZXNbMV1cbiAgICBlbWFpbDogbWF0Y2hlc1syXVxuICAgIGZpbGVzOiBbXVxuICB9XG5cblxuIyMjOjpcbnR5cGUgQ29tbWl0ID0ge1xuICB0aW1lOiBudW1iZXIsXG4gIGVtYWlsOiBzdHJpbmcsXG4gIGZpbGVzOiBBcnJheTx7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGFkZGVkOiBudW1iZXIsXG4gICAgZGVsZXRlZDogbnVtYmVyXG4gIH0+XG59XG4jIyNcblxuXG5cbnBhcnNlQ29tbWl0Q2hhbmdlcyA9IChsaW5lcykgPT5cbiAgbGluZXMubWFwIChsaW5lKSA9PlxuICAgIHBhcnRzID0gbGluZS5zcGxpdCAnXFx0J1xuICAgIHtcbiAgICAgIGFkZGVkOiBOdW1iZXIgcGFydHNbMF1cbiAgICAgIGRlbGV0ZWQ6IE51bWJlciBwYXJ0c1sxXVxuICAgICAgbmFtZTogcGFydHNbMl1cbiAgICB9XG5cblxuXG5jbGFzcyBDaGFuZ2VzT2JqZWN0U3RyZWFtIGV4dGVuZHMgVHJhbnNmb3JtXG4gICMjIzo6XG4gIGxhc3RDb21taXQ6ID9Db21taXRcbiAgIyMjXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgc3VwZXIoeyBvYmplY3RNb2RlOiB0cnVlIH0pXG4gICAgQGxhc3RDb21taXQgPSBudWxsXG5cbiAgX3RyYW5zZm9ybTogKGNodW5rICMjIzogQnVmZmVyIHwgc3RyaW5nICMjIykgIyMjOiB2b2lkICMjIyAtPlxuICAgIGNodW5rID0gY2h1bmsudG9TdHJpbmcoKVxuICAgIHJhd0NvbW1pdHMgPSBjaHVuay5zcGxpdCAnXFxuXFxuXFxuJ1xuICAgIHJhd0NvbW1pdHMgPSBjb21wYWN0IHJhd0NvbW1pdHNcbiAgICByYXdDb21taXRzID0gcmF3Q29tbWl0cy5tYXAgdHJpbVxuICAgIGNvbW1pdE9iamVjdHMgPSByYXdDb21taXRzLnJlZHVjZSAoY29tbWl0cywgcmF3KSA9PlxuICAgICAgbGluZXMgPSBjb21wYWN0IHJhdy5zcGxpdCAnXFxuJ1xuICAgICAgY29tbWl0ID0gbWF0Y2hDb21taXRIZWFkZXIgbGluZXNbMF1cbiAgICAgIGlmIGNvbW1pdFxuICAgICAgICBjb21taXQuZmlsZXMgPSBwYXJzZUNvbW1pdENoYW5nZXMgbGluZXMuc2xpY2UgMVxuICAgICAgICBAbGFzdENvbW1pdCA9IGNvbW1pdFxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIC4uLmNvbW1pdHMsXG4gICAgICAgICAgY29tbWl0XG4gICAgICAgIF1cbiAgICAgIGNvbW1pdCA9IEBsYXN0Q29tbWl0XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ1N0cmVhbSBtdXN0IGJlZ2luIGF0IHN0YXJ0IG9mIGEgY29tbWl0JyBpZiBjb21taXQgPT0gbnVsbFxuICAgICAgY2hhbmdlZEZpbGVzID0gcGFyc2VDb21taXRDaGFuZ2VzIGxpbmVzXG4gICAgICBjaGFuZ2VkRmlsZXMuZm9yRWFjaCAoY2hhbmdlZEZpbGUpID0+XG4gICAgICAgIGV4aXN0aW5nRmlsZSA9IGNvbW1pdC5maWxlcy5maW5kIChmaWxlKSA9PiBmaWxlLm5hbWUgPT0gY2hhbmdlZEZpbGUubmFtZVxuICAgICAgICBpZiBleGlzdGluZ0ZpbGVcbiAgICAgICAgICBleGlzdGluZ0ZpbGUuYWRkZWQgKz0gY2hhbmdlZEZpbGUuYWRkZWRcbiAgICAgICAgICBleGlzdGluZ0ZpbGUuZGVsZXRlZCArPSBjaGFuZ2VkRmlsZS5kZWxldGVkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb21taXQuZmlsZXMucHVzaCBjaGFuZ2VkRmlsZVxuICAgICAgY29tbWl0c1xuICAgICwgW11cbiAgICBjb21taXRPYmplY3RzLmZvckVhY2ggKGNvbW1pdCkgPT4gQHB1c2ggY29tbWl0XG5cblxuXG5jbGFzcyBVc2VyRmlsZUNoYW5nZUNvdW50TWF0cml4XG4gICMjIzo6XG4gIG1hdHJpeDogQXJyYXk8W3N0cmluZywgQXJyYXk8W3N0cmluZywgbnVtYmVyXT5dPlxuICBmaWxlczogQXJyYXk8c3RyaW5nPlxuICBlbWFpbHM6IEFycmF5PHN0cmluZz5cbiAgIyMjXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgIyBUaGUgbWF0cml4IGlzIGEgdGFibGUgd2l0aCB1c2VycyBhbG9uZyBvbmUgYXhpcyBhbmQgZmlsZXMgYWxvbmcgdGhlIG90aGVyXG4gICAgIyBheGlzLCBhbmQgdGhlIG51bWJlciBvZiBjaGFuZ2VkIGxpbmVzIGEgdXNlciBoYXMgZm9yIGEgZmlsZSBhcyB0aGUgY2VsbC5cbiAgICAjIFdlIHN0b3JlIHRoZSBtYXRyaXggaW50ZXJuYWxseSBhcyBhIDItZGltZW5zaW9uYWwgYXJyYXkgb2Ygc2l6ZSBcbiAgICAjIGA8bnVtIHVzZXJzPiB4IDxudW0gZmlsZXM+YCwgYW5kIHdoZXJlIGVhY2ggZW50cnkgaXMgYSBrZXktdmFsdWUgcGFpci5cbiAgICAjIFRoZSB1c2VyIGVudHJ5IGlzIG91dGVybW9zdCBhbmQgdGhlIGZpbGUgZW50cnkgaXMgaW5uZXJtb3N0LiBUaGUgdXNlciBcbiAgICAjIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxlbWFpbD4sIFsgPGZpbGUgZW50cnk+IF0gXWAsIGFuZCB0aGUgXG4gICAgIyBmaWxlIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxmaWxlbmFtZT4sIDx1c2VyIGZpbGUgbGluZSBjaGFuZ2UgY291bnQ+IF1gLlxuICAgICMgYGBgXG4gICAgIyBbXG4gICAgIyAgIFsgJ3VzZXIxJywgW1xuICAgICMgICAgIFsgJ2ZpbGUxJywgMCBdLFxuICAgICMgICAgIFsgJ2ZpbGUyJywgMyBdXG4gICAgIyAgICAgWyAnZmlsZTMnLCAwXVxuICAgICMgICBdXSxcbiAgICAjICAgWyAndXNlcjInLCBbXG4gICAgIyAgICAgWyAnZmlsZTEnLCAxMiBdLFxuICAgICMgICAgIFsgJ2ZpbGUyJywgIDAgXSxcbiAgICAjICAgICBbICdmaWxlMycsICAzIF1cbiAgICAjICAgXV0sXG4gICAgIyBdXG4gICAgIyBgYGBcbiAgICBAbWF0cml4ID0gW11cbiAgICBAZmlsZXMgPSBbXVxuICAgIEBlbWFpbHMgPSBbXVxuICBcbiAgYWRkQ29tbWl0OiAoY29tbWl0KSAtPlxuICAgIEBlbWFpbHMgPSB1bmlvbiBAZW1haWxzLCBbY29tbWl0LmVtYWlsXVxuICAgIGNvbW1pdEZpbGVOYW1lcyA9IGNvbW1pdC5maWxlcy5tYXAgKGZpbGUpID0+IGZpbGUubmFtZVxuICAgIEBmaWxlcyA9IHVuaW9uIEBmaWxlcywgY29tbWl0RmlsZU5hbWVzXG4gICAgQHJlc2hhcGVNYXRyaXgoKVxuICAgIHVzZXIgPSBAbWF0cml4LmZpbmQgKHUpID0+IHVbMF0gPT0gY29tbWl0LmVtYWlsXG4gICAgdGhyb3cgbmV3IEVycm9yICdNYXRyaXggZGlkIG5vdCBjb250YWluZXIgdXNlcicgaWYgIXVzZXJcbiAgICB1c2VyRmlsZXMgPSB1c2VyWzFdXG4gICAgdXNlckZpbGVzLmZvckVhY2ggKHVzZXJGaWxlKSA9PlxuICAgICAgY29tbWl0RmlsZSA9IGNvbW1pdC5maWxlcy5maW5kIChmaWxlKSA9PiBmaWxlLm5hbWUgPT0gdXNlckZpbGVbMF1cbiAgICAgIGlmIGNvbW1pdEZpbGVcbiAgICAgICAgdXNlckZpbGVbMV0gKz0gY29tbWl0RmlsZS5hZGRlZCArIGNvbW1pdEZpbGUuZGVsZXRlZFxuXG4gICMgRW5zdXJlIHRoYXQgd2UgaGF2ZSBhbiBlbnRyeSBpbiB0aGUgbWF0cml4IGZvciBldmVyeSBlbWFpbCBpbiBgQGVtYWlsc2AsXG4gICMgYW5kIGVuc3VyZSB0aGF0IGV2ZXJ5IHVzZXIgaGFzIGFuIGVudHJ5IGZvciBldmVyeSBmaWxlIGluIGBAZmlsZXNgLlxuICByZXNoYXBlTWF0cml4OiAoKSAtPlxuICAgIGN1cnJlbnRFbWFpbHMgPSBAbWF0cml4Lm1hcCAodXNlcikgPT4gdXNlclswXVxuICAgIG5ld0VtYWlscyA9IGRpZmZlcmVuY2UgQGVtYWlscywgY3VycmVudEVtYWlsc1xuICAgIG5ld0VtYWlscy5mb3JFYWNoIChlbWFpbCkgPT4gXG4gICAgICBAbWF0cml4LnB1c2ggWyBlbWFpbCwgW10gXVxuICAgIEBtYXRyaXguZm9yRWFjaCAodXNlcikgPT5cbiAgICAgIGZpbGVzID0gdXNlclsxXVxuICAgICAgY3VycmVudEZpbGVzID0gZmlsZXMubWFwIChmaWxlKSA9PiBmaWxlWzBdXG4gICAgICBuZXdGaWxlcyA9IGRpZmZlcmVuY2UgQGZpbGVzLCBjdXJyZW50RmlsZXNcbiAgICAgIG5ld0ZpbGVzLmZvckVhY2ggKGZpbGUpID0+XG4gICAgICAgIGZpbGVzLnB1c2ggWyBmaWxlLCAwIF1cblxuXG5cblxubWFpbiA9ICgpID0+XG4gIGNoYW5nZXNQcm9jID1cbiAgICBzcGF3biAnZ2l0JyxcbiAgICAgIFsnLS1uby1wYWdlcicsICdsb2cnLCAnLS1mb3JtYXQ9JW4lbiVjdCAlYWUnLCAnLS1udW1zdGF0JywgJy0tbm8tbWVyZ2VzJywgJy0tbm8tcmVuYW1lcyddLFxuICAgICAgeyBlbnY6IHsgLi4ucHJvY2Vzcy5lbnYsIEdJVF9GTFVTSDogMCB9IH1cbiAgY2hhbmdlc1Jhd1N0cmVhbSA9IGNoYW5nZXNQcm9jLnN0ZG91dFxuICBjaGFuZ2VzT2JqZWN0U3RyZWFtID0gbmV3IENoYW5nZXNPYmplY3RTdHJlYW1cbiAgY2hhbmdlc1Jhd1N0cmVhbS5waXBlIGNoYW5nZXNPYmplY3RTdHJlYW1cbiAgbWF0cml4ID0gbmV3IFVzZXJGaWxlQ2hhbmdlQ291bnRNYXRyaXhcbiAgZW5kID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICBjaGFuZ2VzT2JqZWN0U3RyZWFtLm9uICdkYXRhJywgKGNvbW1pdCkgPT4gbWF0cml4LmFkZENvbW1pdCBjb21taXRcbiAgICBjaGFuZ2VzUHJvYy5vbiAnZXhpdCcsICgpID0+XG4gICAgICBkZWJ1ZyBtYXRyaXhcbiAgICAgIHJlc29sdmUoKVxuXG4gIGF3YWl0IGVuZFxuXG5cbm1haW4oKSJdfQ==
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/index.coffee