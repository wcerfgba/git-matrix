// @flow
var ChangesObjectStream, Transform, compact, matchCommitHeader, parseChangeCount, parseCommitChanges, trim;

({Transform} = require('stream'));

({compact, trim} = require('./util'));

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

  _transform(chunk/*: Buffer | string */, encoding, callback)/*: void */ {
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
          existingFile.linesAdded += changedFile.linesAdded;
          return existingFile.linesDeleted += changedFile.linesDeleted;
        } else {
          return commit.files.push(changedFile);
        }
      });
      return commits;
    }, []);
    commitObjects.forEach((commit) => {
      return this.push(commit);
    });
    return callback();
  }

};

module.exports = ChangesObjectStream;

//# sourceMappingURL=ChangesObjectStream.js.map
