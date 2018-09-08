  // @flow
var ChangesObjectStream, FILE_REGEXP, FileLineDoesNotMatchError, HEADER_REGEXP, MissingLineError, TooManyChunksSinceLastCommitError, Transform, compact, debug, matchCommitHeader, matchRawCommit, parseChangeCount, parseCommitChanges, shift, sumBy, trim,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

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

FILE_REGEXP = /^(\d+|-)\t(\d+|-)\t(.*)$/;

matchRawCommit = (text) => {
  var commit, e, files, header, lastLine, length, lines;
  try {
    // console.log text
    lines = text.split('\n');
    if (lines.length === 0) {
      // console.log lines
      return false;
    }
    while (lines[0] === '') {
      // Scrub empty lines at beginning.
      shift(lines);
    }
    header = (shift(lines)).match(HEADER_REGEXP);
    if (!header) {
      return false;
    }
    if ((shift(lines)) !== '') {
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
    commit = {
      time: Number(header[1]),
      email: header[2],
      files
    };
    length = sumBy(['\n\n', header[0], '\n', '\n', lines.slice(0, lastLine).join('\n'), '\n'], (string) => {
      return string.length;
    });
    return {commit, length};
  } catch (error) {
    e = error;
    if (e instanceof FileLineDoesNotMatchError || e instanceof MissingLineError) {
      return false;
    }
    throw e;
  }
};

(FileLineDoesNotMatchError = class FileLineDoesNotMatchError {}) < Error;

(MissingLineError = class MissingLineError {}) < Error;

shift = (xs) => {
  if (!xs || xs.length === 0) {
    throw new MissingLineError;
  }
  return xs.shift();
};

ChangesObjectStream = class ChangesObjectStream extends Transform {
  /*::
  lastCommit: ?Commit
  */
  constructor() {
    super({
      readableObjectMode: true
    });
    this.assertChunksSinceLastCommit = this.assertChunksSinceLastCommit.bind(this);
    this.buffer = '';
    this.totalBytesRead = 0;
    this.totalCommitsMatched = 0;
    this.chunksSinceLastCommit = 0;
  }

  _transform(chunk/*: Buffer */, encoding, callback)/*: void */ {
    var commit, commitsMatched, length, matchedCommit, newData;
    this.totalBytesRead += chunk.length;
    // console.log 'inside:', @totalBytesRead
    this.buffer += chunk.toString();
    // console.log '@buffer.length', @buffer.length
    commitsMatched = 0;
    while (matchedCommit = matchRawCommit(this.buffer)) {
      ({commit, length} = matchedCommit);
      // console.log 'length:', length
      // console.log matchedCommit
      this.buffer = this.buffer.slice(length);
      // console.log '\n---BEGIN---\n', @buffer, '\n---END---\n'
      this.push(commit);
      newData = true;
      commitsMatched += 1;
    }
    // debug @buffer
    this.totalCommitsMatched += commitsMatched;
    this.assertChunksSinceLastCommit(commitsMatched);
    if (newData) {
      // console.log 'commitsMatched', commitsMatched
      return callback();
    }
  }

  assertChunksSinceLastCommit(commitsMatched/*: number */) {
    boundMethodCheck(this, ChangesObjectStream);
    if (commitsMatched > 0) {
      this.chunksSinceLastCommit = 0;
    }
    if (!(commitsMatched > 0)) {
      this.chunksSinceLastCommit += 1;
    }
    if (this.chunksSinceLastCommit >= 1) {
      throw new TooManyChunksSinceLastCommitError(this);
    }
  }

};

module.exports = ChangesObjectStream;

TooManyChunksSinceLastCommitError = class TooManyChunksSinceLastCommitError extends Error {
  constructor(changesObjectStream) {
    super();
    this.bufferHead = changesObjectStream.buffer.slice(0, 1024);
    this.message = `Too many chunks since last commit. Buffer head:\n\`\`\`\n${this.bufferHead}\n\`\`\``;
  }

};
