  // @flow
var ChangesObjectStream, FILE_REGEXP, FileLineDoesNotMatchError, HEADER_REGEXP, MissingLineError, TooManyChunksSinceLastCommitError, Transform, WRAPPER_REGEXP, compact, debug, matchRawCommit, parseChangeCount, shift, sumBy, trim,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

({Transform} = require('stream'));

({compact, trim, sumBy, debug} = require('./util'));

parseChangeCount = (count) => {
  if (count === '-') {
    return 1;
  }
  return Number(count);
};

WRAPPER_REGEXP = /\n\n([\s\S]*?)\n\n\n/;

HEADER_REGEXP = /^(\d+) (.*)$/;

FILE_REGEXP = /^(\d+|-)\t(\d+|-)\t(.*)$/;

matchRawCommit = (text) => {
  var commit, e, files, header, length, lines, noFiles;
  try {
    // console.log 'qwe' if text.startsWith '\n\n1473640846'
    // Commit should be wrapped in two newlines.
    text = text.match(WRAPPER_REGEXP);
    if (!text) {
      return false;
    }
    text = text[1];
    // console.log text
    lines = text.split('\n');
    // console.log lines
    header = (shift(lines)).match(HEADER_REGEXP);
    if (!header) {
      return false;
    }
    if (lines.length === 0) {
      // Next line is empty, or would be if the commit had files.
      noFiles = true;
    }
    if (!noFiles) {
      if ((shift(lines)) !== '') {
        return false;
      }
    }
    // # Last file line should terminate with a newline, leaving an empty string
    // # at the end of the array, so find the first empty string in the array
    // # and terminate the commit there.
    // lastLine = lines.indexOf ''
    // return false if lastLine == -1
    // # After lastLine, we expect the final second newline which marks the end
    // # of the numstats, and the end of the commit.
    // return false if lines.length <= lastLine || lines[lastLine + 1] != ''
    // files = lines.slice 0, lastLine
    files = lines.map((line) => {
      var file;
      file = line.match(FILE_REGEXP);
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
    // Don't take off the last two newlines, because they wrap the start of 
    // the next commit.
    length = sumBy(['\n', '\n', header[0], '\n', noFiles ? '' : '\n', lines.join('\n', '\n'), noFiles ? '' : '\n'], (string) => {
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
    this.processBuffer = this.processBuffer.bind(this);
    this.assertChunksSinceLastCommit = this.assertChunksSinceLastCommit.bind(this);
    this.buffer = '';
    this.totalBytesRead = 0;
    this.totalCommitsMatched = 0;
    this.chunksSinceLastCommit = 0;
  }

  _transform(chunk/*: Buffer */, encoding, callback)/*: void */ {
    this.totalBytesRead += chunk.length;
    // console.log 'inside:', @totalBytesRead
    this.buffer += chunk.toString();
    return this.processBuffer(callback);
  }

  processBuffer(callback) {
    var commit, commitsMatched, length, matchedCommit, newData;
    boundMethodCheck(this, ChangesObjectStream);
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

  _flush(callback) {
    // Force a final commit to be flushed by ensuring we can match the end of
    // a list of numstat lines.
    this.buffer += '\n\n';
    return this.processBuffer(callback);
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
