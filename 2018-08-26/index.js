// @flow
var ChangesObjectStream, Transform, UserFileCommitCountMatrix, compact, debug, difference, inspect, isEmpty, last, main, matchCommit, spawn, trim, union;

({Transform} = require('stream'));

({spawn} = require('child_process'));

({compact, last, difference, isEmpty, trim, union} = require('lodash'));

({inspect} = require('util'));

debug = (...xs) => {
  return console.debug(inspect(xs, {
    depth: null
  }));
};

matchCommit = (str)/*: ?Commit */ => {
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

/*::
type Commit = {
time: number,
email: string,
files: Array<string>
}
*/
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
      var commit, lines, newcommit;
      lines = compact(raw.split('\n'));
      commit = matchCommit(lines[0]);
      if (commit) {
        newcommit = true;
        lines.shift();
      } else {
        commit = this.lastCommit;
        newcommit = false;
      }
      if (!commit) {
        throw new Error('Stream must begin at start of a commit');
      }
      commit.files = [...commit.files, ...(compact(lines))];
      if (newcommit || isEmpty(commits)) {
        commits.push(commit);
        this.lastCommit = commit;
      }
      return commits;
    }, []);
    return commitObjects.forEach((commit) => {
      return this.push(commit);
    });
  }

};

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

main = async() => {
  var changesObjectStream, changesProc, changesRawStream, end, matrix;
  changesProc = spawn('git', ['--no-pager', 'log', '--format=%n%n%ct %ae', '--name-only', '--no-merges'], {
    env: {
      ...process.env,
      GIT_FLUSH: 0
    }
  });
  changesRawStream = changesProc.stdout;
  changesObjectStream = new ChangesObjectStream;
  changesRawStream.pipe(changesObjectStream);
  matrix = new UserFileCommitCountMatrix;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxJQUFBLG1CQUFBLEVBQUEsU0FBQSxFQUFBLHlCQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBOztBQUVBLENBQUEsQ0FBRSxTQUFGLENBQUEsR0FBZ0IsT0FBQSxDQUFRLFFBQVIsQ0FBaEI7O0FBQ0EsQ0FBQSxDQUFFLEtBQUYsQ0FBQSxHQUFZLE9BQUEsQ0FBUSxlQUFSLENBQVo7O0FBQ0EsQ0FBQSxDQUFFLE9BQUYsRUFBVyxJQUFYLEVBQWlCLFVBQWpCLEVBQTZCLE9BQTdCLEVBQXNDLElBQXRDLEVBQTRDLEtBQTVDLENBQUEsR0FBc0QsT0FBQSxDQUFRLFFBQVIsQ0FBdEQ7O0FBQ0EsQ0FBQSxDQUFFLE9BQUYsQ0FBQSxHQUFjLE9BQUEsQ0FBUSxNQUFSLENBQWQ7O0FBSUEsS0FBQSxHQUFRLENBQUEsR0FBSSxFQUFKLENBQUEsR0FBQTtTQUFXLE9BQU8sQ0FBQyxLQUFSLENBQWMsT0FBQSxDQUFRLEVBQVIsRUFBWTtJQUFFLEtBQUEsRUFBTztFQUFULENBQVosQ0FBZDtBQUFYOztBQUlSLFdBQUEsR0FBYyxDQUFDLEdBQUQsZUFBQSxHQUFBO0FBQ1osTUFBQTtFQUFBLE9BQUEsR0FBVSxHQUFHLENBQUMsS0FBSixDQUFVLGlCQUFWO0VBQ1YsSUFBZSxDQUFDLE9BQWhCO0FBQUEsV0FBTyxLQUFQOztTQUNBO0lBQ0UsSUFBQSxFQUFNLE1BQUEsQ0FBTyxPQUFRLENBQUEsQ0FBQSxDQUFmLENBRFI7SUFFRSxLQUFBLEVBQU8sT0FBUSxDQUFBLENBQUEsQ0FGakI7SUFHRSxLQUFBLEVBQU87RUFIVDtBQUhZLEVBYmQ7Ozs7Ozs7OztBQWlDTSxzQkFBTixNQUFB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LEVBQVc7SUFBN0I7RUFBUCxDQUZGO0VBR0YsZ0JBQUEsR0FBbUIsV0FBVyxDQUFDO0VBQy9CLG1CQUFBLEdBQXNCLElBQUk7RUFDMUIsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsbUJBQXRCO0VBQ0EsTUFBQSxHQUFTLElBQUk7RUFDYixHQUFBLEdBQU0sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFBLEdBQUE7SUFDaEIsbUJBQW1CLENBQUMsRUFBcEIsQ0FBdUIsTUFBdkIsRUFBK0IsQ0FBQyxNQUFELENBQUEsR0FBQTthQUFZLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQWpCO0lBQVosQ0FBL0I7V0FDQSxXQUFXLENBQUMsRUFBWixDQUFlLE1BQWYsRUFBdUIsQ0FBQSxDQUFBLEdBQUE7TUFDckIsS0FBQSxDQUFNLE1BQU47YUFDQSxPQUFBLENBQUE7SUFGcUIsQ0FBdkI7RUFGZ0IsQ0FBWjtTQU1OLENBQUEsTUFBTSxHQUFOO0FBZks7O0FBa0JQLElBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMgQGZsb3dcblxueyBUcmFuc2Zvcm0gfSA9IHJlcXVpcmUgJ3N0cmVhbSdcbnsgc3Bhd24gfSA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG57IGNvbXBhY3QsIGxhc3QsIGRpZmZlcmVuY2UsIGlzRW1wdHksIHRyaW0sIHVuaW9uIH0gPSByZXF1aXJlICdsb2Rhc2gnXG57IGluc3BlY3QgfSA9IHJlcXVpcmUgJ3V0aWwnXG5cblxuXG5kZWJ1ZyA9ICguLi54cykgPT4gY29uc29sZS5kZWJ1ZyBpbnNwZWN0IHhzLCB7IGRlcHRoOiBudWxsIH1cblxuXG5cbm1hdGNoQ29tbWl0ID0gKHN0cikgIyMjOiA/Q29tbWl0ICMjIyA9PlxuICBtYXRjaGVzID0gc3RyLm1hdGNoKC9eKFxcZCspICguKkAuKikkLylcbiAgcmV0dXJuIG51bGwgaWYgIW1hdGNoZXNcbiAge1xuICAgIHRpbWU6IE51bWJlciBtYXRjaGVzWzFdXG4gICAgZW1haWw6IG1hdGNoZXNbMl1cbiAgICBmaWxlczogW11cbiAgfVxuXG5cbiMjIzo6XG50eXBlIENvbW1pdCA9IHtcbiAgdGltZTogbnVtYmVyLFxuICBlbWFpbDogc3RyaW5nLFxuICBmaWxlczogQXJyYXk8c3RyaW5nPlxufVxuIyMjXG5cblxuXG5jbGFzcyBDaGFuZ2VzT2JqZWN0U3RyZWFtIGV4dGVuZHMgVHJhbnNmb3JtXG4gICMjIzo6XG4gIGxhc3RDb21taXQ6ID9Db21taXRcbiAgIyMjXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgc3VwZXIoeyBvYmplY3RNb2RlOiB0cnVlIH0pXG4gICAgQGxhc3RDb21taXQgPSBudWxsXG5cbiAgX3RyYW5zZm9ybTogKGNodW5rICMjIzogQnVmZmVyIHwgc3RyaW5nICMjIykgIyMjOiB2b2lkICMjIyAtPlxuICAgIGNodW5rID0gY2h1bmsudG9TdHJpbmcoKVxuICAgIHJhd0NvbW1pdHMgPSBjaHVuay5zcGxpdCAnXFxuXFxuXFxuJ1xuICAgIHJhd0NvbW1pdHMgPSBjb21wYWN0IHJhd0NvbW1pdHNcbiAgICByYXdDb21taXRzID0gcmF3Q29tbWl0cy5tYXAgdHJpbVxuICAgIGNvbW1pdE9iamVjdHMgPSByYXdDb21taXRzLnJlZHVjZSAoY29tbWl0cywgcmF3KSA9PlxuICAgICAgbGluZXMgPSBjb21wYWN0IHJhdy5zcGxpdCAnXFxuJ1xuICAgICAgY29tbWl0ID0gbWF0Y2hDb21taXQgbGluZXNbMF1cbiAgICAgIGlmIGNvbW1pdFxuICAgICAgICBuZXdjb21taXQgPSB0cnVlXG4gICAgICAgIGxpbmVzLnNoaWZ0KClcbiAgICAgIGVsc2VcbiAgICAgICAgY29tbWl0ID0gQGxhc3RDb21taXRcbiAgICAgICAgbmV3Y29tbWl0ID0gZmFsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciAnU3RyZWFtIG11c3QgYmVnaW4gYXQgc3RhcnQgb2YgYSBjb21taXQnIGlmICFjb21taXRcbiAgICAgIGNvbW1pdC5maWxlcyA9IFtcbiAgICAgICAgLi4uY29tbWl0LmZpbGVzXG4gICAgICAgIC4uLihjb21wYWN0IGxpbmVzKVxuICAgICAgXVxuICAgICAgaWYgbmV3Y29tbWl0IHx8IGlzRW1wdHkgY29tbWl0c1xuICAgICAgICBjb21taXRzLnB1c2ggY29tbWl0XG4gICAgICAgIEBsYXN0Q29tbWl0ID0gY29tbWl0XG4gICAgICBjb21taXRzXG4gICAgLCBbXVxuICAgIGNvbW1pdE9iamVjdHMuZm9yRWFjaCAoY29tbWl0KSA9PiBAcHVzaCBjb21taXRcblxuXG5cbmNsYXNzIFVzZXJGaWxlQ29tbWl0Q291bnRNYXRyaXhcbiAgIyMjOjpcbiAgbWF0cml4OiBBcnJheTxbc3RyaW5nLCBBcnJheTxbc3RyaW5nLCBudW1iZXJdPl0+XG4gIGZpbGVzOiBBcnJheTxzdHJpbmc+XG4gIGVtYWlsczogQXJyYXk8c3RyaW5nPlxuICAjIyNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIFRoZSBtYXRyaXggaXMgYSB0YWJsZSB3aXRoIHVzZXJzIGFsb25nIG9uZSBheGlzIGFuZCBmaWxlcyBhbG9uZyB0aGUgb3RoZXJcbiAgICAjIGF4aXMsIGFuZCB0aGUgbnVtYmVyIG9mIGNvbW1pdHMgYSB1c2VyIGhhcyBmb3IgYSBmaWxlIGFzIHRoZSBjZWxsLiBXZSBcbiAgICAjIHN0b3JlIHRoZSBtYXRyaXggaW50ZXJuYWxseSBhcyBhIDItZGltZW5zaW9uYWwgYXJyYXkgb2Ygc2l6ZSBcbiAgICAjIGA8bnVtIHVzZXJzPiB4IDxudW0gZmlsZXM+YCwgYW5kIHdoZXJlIGVhY2ggZW50cnkgaXMgYSBrZXktdmFsdWUgcGFpci5cbiAgICAjIFRoZSB1c2VyIGVudHJ5IGlzIG91dGVybW9zdCBhbmQgdGhlIGZpbGUgZW50cnkgaXMgaW5uZXJtb3N0LiBUaGUgdXNlciBcbiAgICAjIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxlbWFpbD4sIFsgPGZpbGUgZW50cnk+IF0gXWAsIGFuZCB0aGUgXG4gICAgIyBmaWxlIGVudHJ5IGlzIG9mIHRoZSBmb3JtIGBbIDxmaWxlbmFtZT4sIDx1c2VyIGZpbGUgY29tbWl0IGNvdW50PiBdYC5cbiAgICAjIGBgYFxuICAgICMgW1xuICAgICMgICBbICd1c2VyMScsIFtcbiAgICAjICAgICBbICdmaWxlMScsIDAgXSxcbiAgICAjICAgICBbICdmaWxlMicsIDMgXVxuICAgICMgICAgIFsgJ2ZpbGUzJywgMF1cbiAgICAjICAgXV0sXG4gICAgIyAgIFsgJ3VzZXIyJywgW1xuICAgICMgICAgIFsgJ2ZpbGUxJywgMTIgXSxcbiAgICAjICAgICBbICdmaWxlMicsICAwIF0sXG4gICAgIyAgICAgWyAnZmlsZTMnLCAgMyBdXG4gICAgIyAgIF1dLFxuICAgICMgXVxuICAgICMgYGBgXG4gICAgQG1hdHJpeCA9IFtdXG4gICAgQGZpbGVzID0gW11cbiAgICBAZW1haWxzID0gW11cbiAgXG4gIGFkZENvbW1pdDogKGNvbW1pdCkgLT5cbiAgICBAZW1haWxzID0gdW5pb24gQGVtYWlscywgW2NvbW1pdC5lbWFpbF1cbiAgICBAZmlsZXMgPSB1bmlvbiBAZmlsZXMsIGNvbW1pdC5maWxlc1xuICAgIEByZXNoYXBlTWF0cml4KClcbiAgICB1c2VyID0gQG1hdHJpeC5maW5kICh1KSA9PiB1WzBdID09IGNvbW1pdC5lbWFpbFxuICAgIHRocm93IG5ldyBFcnJvciAnTWF0cml4IGRpZCBub3QgY29udGFpbmVyIHVzZXInIGlmICF1c2VyXG4gICAgZmlsZXMgPSB1c2VyWzFdXG4gICAgZmlsZXMuZm9yRWFjaCAoZmlsZSkgPT5cbiAgICAgIGZpbGVbMV0gKz0gMSBpZiBjb21taXQuZmlsZXMuaW5jbHVkZXMgZmlsZVswXVxuXG4gICMgRW5zdXJlIHRoYXQgd2UgaGF2ZSBhbiBlbnRyeSBpbiB0aGUgbWF0cml4IGZvciBldmVyeSBlbWFpbCBpbiBgQGVtYWlsc2AsXG4gICMgYW5kIGVuc3VyZSB0aGF0IGV2ZXJ5IHVzZXIgaGFzIGFuIGVudHJ5IGZvciBldmVyeSBmaWxlIGluIGBAZmlsZXNgLlxuICByZXNoYXBlTWF0cml4OiAoKSAtPlxuICAgIGN1cnJlbnRFbWFpbHMgPSBAbWF0cml4Lm1hcCAodXNlcikgPT4gdXNlclswXVxuICAgIG5ld0VtYWlscyA9IGRpZmZlcmVuY2UgQGVtYWlscywgY3VycmVudEVtYWlsc1xuICAgIG5ld0VtYWlscy5mb3JFYWNoIChlbWFpbCkgPT4gXG4gICAgICBAbWF0cml4LnB1c2ggWyBlbWFpbCwgW10gXVxuICAgIEBtYXRyaXguZm9yRWFjaCAodXNlcikgPT5cbiAgICAgIGZpbGVzID0gdXNlclsxXVxuICAgICAgY3VycmVudEZpbGVzID0gZmlsZXMubWFwIChmaWxlKSA9PiBmaWxlWzBdXG4gICAgICBuZXdGaWxlcyA9IGRpZmZlcmVuY2UgQGZpbGVzLCBjdXJyZW50RmlsZXNcbiAgICAgIG5ld0ZpbGVzLmZvckVhY2ggKGZpbGUpID0+XG4gICAgICAgIGZpbGVzLnB1c2ggWyBmaWxlLCAwIF1cblxuXG5cblxubWFpbiA9ICgpID0+XG4gIGNoYW5nZXNQcm9jID1cbiAgICBzcGF3biAnZ2l0JyxcbiAgICAgIFsnLS1uby1wYWdlcicsICdsb2cnLCAnLS1mb3JtYXQ9JW4lbiVjdCAlYWUnLCAnLS1uYW1lLW9ubHknLCAnLS1uby1tZXJnZXMnXSxcbiAgICAgIHsgZW52OiB7IC4uLnByb2Nlc3MuZW52LCBHSVRfRkxVU0g6IDAgfSB9XG4gIGNoYW5nZXNSYXdTdHJlYW0gPSBjaGFuZ2VzUHJvYy5zdGRvdXRcbiAgY2hhbmdlc09iamVjdFN0cmVhbSA9IG5ldyBDaGFuZ2VzT2JqZWN0U3RyZWFtXG4gIGNoYW5nZXNSYXdTdHJlYW0ucGlwZSBjaGFuZ2VzT2JqZWN0U3RyZWFtXG4gIG1hdHJpeCA9IG5ldyBVc2VyRmlsZUNvbW1pdENvdW50TWF0cml4XG4gIGVuZCA9IG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgY2hhbmdlc09iamVjdFN0cmVhbS5vbiAnZGF0YScsIChjb21taXQpID0+IG1hdHJpeC5hZGRDb21taXQgY29tbWl0XG4gICAgY2hhbmdlc1Byb2Mub24gJ2V4aXQnLCAoKSA9PlxuICAgICAgZGVidWcgbWF0cml4XG4gICAgICByZXNvbHZlKClcblxuICBhd2FpdCBlbmRcblxuXG5tYWluKCkiXX0=
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/index.coffee