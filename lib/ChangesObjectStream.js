// @flow
var ChangesObjectStream, FILE_REGEXP, FileLineDoesNotMatchError, HEADER_REGEXP, Transform, compact, debug, matchCommitHeader, matchRawCommit, parseChangeCount, parseCommitChanges, sumBy, trim;

({Transform} = require('stream'));

({compact, trim, sumBy, debug} = require('./util'));

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

parseChangeCount = (count) => {
  if (count === '-') {
    return 1;
  }
  return Number(count);
};

parseCommitChanges = (lines) => {
  return lines.map((line) => {
    var parts;
    parts = line.split('\t');
    return {
      linesAdded: parseChangeCount(parts[0]),
      linesDeleted: parseChangeCount(parts[1]),
      name: parts[2]
    };
  });
};

HEADER_REGEXP = /^(\d+) (.*@.*)$/;

FILE_REGEXP = /^(\d+)\t(\d+)\t(.*)$/;

matchRawCommit = (text) => {
  var FileLineDoesNotMatchError, commit, files, header, lastLine, length, lines;
  lines = text.split('\n');
  if (lines.shift() !== '') {
    // console.log lines
    // First two lines are empty.
    return false;
  }
  if (lines.shift() !== '') {
    return false;
  }
  header = lines.shift().match(HEADER_REGEXP);
  if (!header) {
    return false;
  }
  if (lines.shift() !== '') {
    // Next line is empty.
    return false;
  }
  // Last file line should terminate with a newline, leaving an empty string
  // at the end of the array, so find the first empty string in the array
  // and terminate the commit there.
  lastLine = lines.indexOf('');
  if (lastLine === -1) {
    return false;
  }
  files = lines.slice(0, lastLine);
  try {
    files = files.map((file) => {
      file = file.match(FILE_REGEXP);
      if (!file) {
        throw new FileLineDoesNotMatchError;
      }
      return {
        linesAdded: parseChangeCount(file[1]),
        linesDeleted: parseChangeCount(file[2]),
        name: file[3]
      };
    });
  } catch (error) {
    FileLineDoesNotMatchError = error;
    return false;
  }
  commit = {
    time: Number(header[1]),
    email: header[2],
    files
  };
  length = sumBy(['\n\n', header[0], '\n', '\n', lines.slice(0, lastLine).join('\n'), '\n'], (string) => {
    return string.length;
  });
  return {commit, length};
};

(FileLineDoesNotMatchError = class FileLineDoesNotMatchError {}) < Error;

ChangesObjectStream = class ChangesObjectStream extends Transform {
  /*::
  lastCommit: ?Commit
  */
  constructor() {
    super({
      objectMode: true
    });
    this.buffer = '';
    this.totalBytesRead = 0;
  }

  _transform(chunk/*: Buffer */, encoding, callback)/*: void */ {
    var commit, length, matchedCommit, newData;
    this.totalBytesRead += chunk.length;
    this.buffer += chunk.toString();
    // console.log @buffer
    while (matchedCommit = matchRawCommit(this.buffer)) {
      ({commit, length} = matchedCommit);
      
      // console.log matchedCommit
      this.buffer = this.buffer.slice(length);
      // console.log @buffer
      this.push(commit);
      newData = true;
    }
    if (newData) {
      // debug @buffer
      return callback();
    }
  }

};

// @totalBytesRead += chunk.length
// console.log @totalBytesRead, 'total bytes read'
// chunk = chunk.toString()
// rawCommits = chunk.split '\n\n\n'
// rawCommits = rawCommits.map trim
// rawCommits = compact rawCommits
// commitObjects = rawCommits.reduce (commits, raw) =>
//   lines = compact raw.split '\n'
//   commit = matchCommitHeader lines[0]
//   if commit
//     commit.files = parseCommitChanges lines.slice 1
//     @lastCommit = commit
//     return [
//       ...commits,
//       commit
//     ]
//   commit = @lastCommit
//   throw new Error 'Stream must begin at start of a commit' if commit == null
//   changedFiles = parseCommitChanges lines
//   changedFiles.forEach (changedFile) =>
//     existingFile = commit.files.find (file) => file.name == changedFile.name
//     if existingFile
//       existingFile.linesAdded += changedFile.linesAdded
//       existingFile.linesDeleted += changedFile.linesDeleted
//     else
//       commit.files.push changedFile
//   commits
// , []
// commitObjects.forEach (commit) => @push commit
// callback()
module.exports = ChangesObjectStream;

//# sourceMappingURL=ChangesObjectStream.js.map
