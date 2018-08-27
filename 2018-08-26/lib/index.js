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
var ChangesObjectStream, Transform, UserFileChangeCountMatrix, compact, debug, difference, elMap, inspect, isEmpty, last, main, matchCommitHeader, matrixToHtml, parseCommitChanges, sortBy, spawn, trim, union;

({Transform} = require('stream'));

({spawn} = require('child_process'));

({compact, last, difference, isEmpty, trim, union, sortBy} = require('lodash'));

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

elMap = (xs) => {
  return (f) => {
    return (xs.map(f)).join('\n');
  };
};

matrixToHtml = (matrix/*: UserFileChangeCountMatrix */)/*: string */ => {
  var emailHeadings, emails, fileRows, users;
  emails = elMap(matrix.emails);
  emailHeadings = emails((email) => {
    return `<th scope='col'>${email}</th>`;
  });
  users = elMap(matrix.matrix);
  fileRows = users((user) => {
    var files;
    files = elMap(user[1]);
    return files((file, i) => {
      var fileCols;
      fileCols = users((user) => {
        return `<td>${user[1][i][1]}</td>`;
      });
      return `<tr>\n  <th scope='row'>${file[0]}</th>\n  ${fileCols}\n</tr>`;
    });
  });
  return `<table>\n  <tr>\n    <td></td>\n    ${emailHeadings}\n  </tr>\n  ${fileRows}\n</table>`;
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
      matrix.sort();
      console.log(matrixToHtml(matrix));
      return resolve();
    });
  });
  return (await end);
};

main();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbInNyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUFBLElBQUEsbUJBQUEsRUFBQSxTQUFBLEVBQUEseUJBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLFVBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsWUFBQSxFQUFBLGtCQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUE7O0FBRUEsQ0FBQSxDQUFFLFNBQUYsQ0FBQSxHQUFnQixPQUFBLENBQVEsUUFBUixDQUFoQjs7QUFDQSxDQUFBLENBQUUsS0FBRixDQUFBLEdBQVksT0FBQSxDQUFRLGVBQVIsQ0FBWjs7QUFDQSxDQUFBLENBQUUsT0FBRixFQUFXLElBQVgsRUFBaUIsVUFBakIsRUFBNkIsT0FBN0IsRUFBc0MsSUFBdEMsRUFBNEMsS0FBNUMsRUFBbUQsTUFBbkQsQ0FBQSxHQUE4RCxPQUFBLENBQVEsUUFBUixDQUE5RDs7QUFDQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQWMsT0FBQSxDQUFRLE1BQVIsQ0FBZDs7QUFJQSxLQUFBLEdBQVEsQ0FBQSxHQUFJLEVBQUosQ0FBQSxHQUFBO1NBQVcsT0FBTyxDQUFDLEtBQVIsQ0FBYyxPQUFBLENBQVEsRUFBUixFQUFZO0lBQUUsS0FBQSxFQUFPO0VBQVQsQ0FBWixDQUFkO0FBQVg7O0FBSVIsaUJBQUEsR0FBb0IsQ0FBQyxHQUFELGVBQUEsR0FBQTtBQUNsQixNQUFBO0VBQUEsT0FBQSxHQUFVLEdBQUcsQ0FBQyxLQUFKLENBQVUsaUJBQVY7RUFDVixJQUFlLENBQUMsT0FBaEI7QUFBQSxXQUFPLEtBQVA7O1NBQ0E7SUFDRSxJQUFBLEVBQU0sTUFBQSxDQUFPLE9BQVEsQ0FBQSxDQUFBLENBQWYsQ0FEUjtJQUVFLEtBQUEsRUFBTyxP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ZWFtJ1xueyBzcGF3biB9ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbnsgY29tcGFjdCwgbGFzdCwgZGlmZmVyZW5jZSwgaXNFbXB0eSwgdHJpbSwgdW5pb24sIHNvcnRCeSB9ID0gcmVxdWlyZSAnbG9kYXNoJ1xueyBpbnNwZWN0IH0gPSByZXF1aXJlICd1dGlsJ1xuXG5cblxuZGVidWcgPSAoLi4ueHMpID0+IGNvbnNvbGUuZGVidWcgaW5zcGVjdCB4cywgeyBkZXB0aDogbnVsbCB9XG5cblxuXG5tYXRjaENvbW1pdEhlYWRlciA9IChzdHIpICMjIzogP0NvbW1pdCAjIyMgPT5cbiAgbWF0Y2hlcyA9IHN0ci5tYXRjaCgvXihcXGQrKSAoLipALiopJC8pXG4gIHJldHVybiBudWxsIGlmICFtYXRjaGVzXG4gIHtcbiAgICB0aW1lOiBOdW1iZXIgbWF0Y2hlc1sxXVxuICAgIGVtYWlsOiBtYXRjaGVzWzJdXG4gICAgZmlsZXM6IFtdXG4gIH1cblxuXG4jIyM6OlxudHlwZSBDb21taXQgPSB7XG4gIHRpbWU6IG51bWJlcixcbiAgZW1haWw6IHN0cmluZyxcbiAgZmlsZXM6IEFycmF5PHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgYWRkZWQ6IG51bWJlcixcbiAgICBkZWxldGVkOiBudW1iZXJcbiAgfT5cbn1cbiMjI1xuXG5cblxucGFyc2VDb21taXRDaGFuZ2VzID0gKGxpbmVzKSA9PlxuICBsaW5lcy5tYXAgKGxpbmUpID0+XG4gICAgcGFydHMgPSBsaW5lLnNwbGl0ICdcXHQnXG4gICAge1xuICAgICAgYWRkZWQ6IE51bWJlciBwYXJ0c1swXVxuICAgICAgZGVsZXRlZDogTnVtYmVyIHBhcnRzWzFdXG4gICAgICBuYW1lOiBwYXJ0c1syXVxuICAgIH1cblxuXG5cbmNsYXNzIENoYW5nZXNPYmplY3RTdHJlYW0gZXh0ZW5kcyBUcmFuc2Zvcm1cbiAgIyMjOjpcbiAgbGFzdENvbW1pdDogP0NvbW1pdFxuICAjIyNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBzdXBlcih7IG9iamVjdE1vZGU6IHRydWUgfSlcbiAgICBAbGFzdENvbW1pdCA9IG51bGxcblxuICBfdHJhbnNmb3JtOiAoY2h1bmsgIyMjOiBCdWZmZXIgfCBzdHJpbmcgIyMjKSAjIyM6IHZvaWQgIyMjIC0+XG4gICAgY2h1bmsgPSBjaHVuay50b1N0cmluZygpXG4gICAgcmF3Q29tbWl0cyA9IGNodW5rLnNwbGl0ICdcXG5cXG5cXG4nXG4gICAgcmF3Q29tbWl0cyA9IGNvbXBhY3QgcmF3Q29tbWl0c1xuICAgIHJhd0NvbW1pdHMgPSByYXdDb21taXRzLm1hcCB0cmltXG4gICAgY29tbWl0T2JqZWN0cyA9IHJhd0NvbW1pdHMucmVkdWNlIChjb21taXRzLCByYXcpID0+XG4gICAgICBsaW5lcyA9IGNvbXBhY3QgcmF3LnNwbGl0ICdcXG4nXG4gICAgICBjb21taXQgPSBtYXRjaENvbW1pdEhlYWRlciBsaW5lc1swXVxuICAgICAgaWYgY29tbWl0XG4gICAgICAgIGNvbW1pdC5maWxlcyA9IHBhcnNlQ29tbWl0Q2hhbmdlcyBsaW5lcy5zbGljZSAxXG4gICAgICAgIEBsYXN0Q29tbWl0ID0gY29tbWl0XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgLi4uY29tbWl0cyxcbiAgICAgICAgICBjb21taXRcbiAgICAgICAgXVxuICAgICAgY29tbWl0ID0gQGxhc3RDb21taXRcbiAgICAgIHRocm93IG5ldyBFcnJvciAnU3RyZWFtIG11c3QgYmVnaW4gYXQgc3RhcnQgb2YgYSBjb21taXQnIGlmIGNvbW1pdCA9PSBudWxsXG4gICAgICBjaGFuZ2VkRmlsZXMgPSBwYXJzZUNvbW1pdENoYW5nZXMgbGluZXNcbiAgICAgIGNoYW5nZWRGaWxlcy5mb3JFYWNoIChjaGFuZ2VkRmlsZSkgPT5cbiAgICAgICAgZXhpc3RpbmdGaWxlID0gY29tbWl0LmZpbGVzLmZpbmQgKGZpbGUpID0+IGZpbGUubmFtZSA9PSBjaGFuZ2VkRmlsZS5uYW1lXG4gICAgICAgIGlmIGV4aXN0aW5nRmlsZVxuICAgICAgICAgIGV4aXN0aW5nRmlsZS5hZGRlZCArPSBjaGFuZ2VkRmlsZS5hZGRlZFxuICAgICAgICAgIGV4aXN0aW5nRmlsZS5kZWxldGVkICs9IGNoYW5nZWRGaWxlLmRlbGV0ZWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbW1pdC5maWxlcy5wdXNoIGNoYW5nZWRGaWxlXG4gICAgICBjb21taXRzXG4gICAgLCBbXVxuICAgIGNvbW1pdE9iamVjdHMuZm9yRWFjaCAoY29tbWl0KSA9PiBAcHVzaCBjb21taXRcblxuXG5cbmNsYXNzIFVzZXJGaWxlQ2hhbmdlQ291bnRNYXRyaXhcbiAgIyMjOjpcbiAgbWF0cml4OiBBcnJheTxbc3RyaW5nLCBBcnJheTxbc3RyaW5nLCBudW1iZXJdPl0+XG4gIGZpbGVzOiBBcnJheTxzdHJpbmc+XG4gIGVtYWlsczogQXJyYXk8c3RyaW5nPlxuICAjIyNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIFRoZSBtYXRyaXggaXMgYSB0YWJsZSB3aXRoIHVzZXJzIGFsb25nIG9uZSBheGlzIGFuZCBmaWxlcyBhbG9uZyB0aGUgb3RoZXJcbiAgICAjIGF4aXMsIGFuZCB0aGUgbnVtYmVyIG9mIGNoYW5nZWQgbGluZXMgYSB1c2VyIGhhcyBmb3IgYSBmaWxlIGFzIHRoZSBjZWxsLlxuICAgICMgV2Ugc3RvcmUgdGhlIG1hdHJpeCBpbnRlcm5hbGx5IGFzIGEgMi1kaW1lbnNpb25hbCBhcnJheSBvZiBzaXplIFxuICAgICMgYDxudW0gdXNlcnM+IHggPG51bSBmaWxlcz5gLCBhbmQgd2hlcmUgZWFjaCBlbnRyeSBpcyBhIGtleS12YWx1ZSBwYWlyLlxuICAgICMgVGhlIHVzZXIgZW50cnkgaXMgb3V0ZXJtb3N0IGFuZCB0aGUgZmlsZSBlbnRyeSBpcyBpbm5lcm1vc3QuIFRoZSB1c2VyIFxuICAgICMgZW50cnkgaXMgb2YgdGhlIGZvcm0gYFsgPGVtYWlsPiwgWyA8ZmlsZSBlbnRyeT4gXSBdYCwgYW5kIHRoZSBcbiAgICAjIGZpbGUgZW50cnkgaXMgb2YgdGhlIGZvcm0gYFsgPGZpbGVuYW1lPiwgPHVzZXIgZmlsZSBsaW5lIGNoYW5nZSBjb3VudD4gXWAuXG4gICAgIyBgYGBcbiAgICAjIFtcbiAgICAjICAgWyAndXNlcjEnLCBbXG4gICAgIyAgICAgWyAnZmlsZTEnLCAwIF0sXG4gICAgIyAgICAgWyAnZmlsZTInLCAzIF1cbiAgICAjICAgICBbICdmaWxlMycsIDBdXG4gICAgIyAgIF1dLFxuICAgICMgICBbICd1c2VyMicsIFtcbiAgICAjICAgICBbICdmaWxlMScsIDEyIF0sXG4gICAgIyAgICAgWyAnZmlsZTInLCAgMCBdLFxuICAgICMgICAgIFsgJ2ZpbGUzJywgIDMgXVxuICAgICMgICBdXSxcbiAgICAjIF1cbiAgICAjIGBgYFxuICAgIEBtYXRyaXggPSBbXVxuICAgIEBmaWxlcyA9IFtdXG4gICAgQGVtYWlscyA9IFtdXG4gIFxuICBhZGRDb21taXQ6IChjb21taXQpIC0+XG4gICAgQGVtYWlscyA9IHVuaW9uIEBlbWFpbHMsIFtjb21taXQuZW1haWxdXG4gICAgY29tbWl0RmlsZU5hbWVzID0gY29tbWl0LmZpbGVzLm1hcCAoZmlsZSkgPT4gZmlsZS5uYW1lXG4gICAgQGZpbGVzID0gdW5pb24gQGZpbGVzLCBjb21taXRGaWxlTmFtZXNcbiAgICBAcmVzaGFwZU1hdHJpeCgpXG4gICAgdXNlciA9IEBtYXRyaXguZmluZCAodSkgPT4gdVswXSA9PSBjb21taXQuZW1haWxcbiAgICB0aHJvdyBuZXcgRXJyb3IgJ01hdHJpeCBkaWQgbm90IGNvbnRhaW5lciB1c2VyJyBpZiAhdXNlclxuICAgIHVzZXJGaWxlcyA9IHVzZXJbMV1cbiAgICB1c2VyRmlsZXMuZm9yRWFjaCAodXNlckZpbGUpID0+XG4gICAgICBjb21taXRGaWxlID0gY29tbWl0LmZpbGVzLmZpbmQgKGZpbGUpID0+IGZpbGUubmFtZSA9PSB1c2VyRmlsZVswXVxuICAgICAgaWYgY29tbWl0RmlsZVxuICAgICAgICB1c2VyRmlsZVsxXSArPSBjb21taXRGaWxlLmFkZGVkICsgY29tbWl0RmlsZS5kZWxldGVkXG5cbiAgIyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGFuIGVudHJ5IGluIHRoZSBtYXRyaXggZm9yIGV2ZXJ5IGVtYWlsIGluIGBAZW1haWxzYCxcbiAgIyBhbmQgZW5zdXJlIHRoYXQgZXZlcnkgdXNlciBoYXMgYW4gZW50cnkgZm9yIGV2ZXJ5IGZpbGUgaW4gYEBmaWxlc2AuXG4gIHJlc2hhcGVNYXRyaXg6ICgpIC0+XG4gICAgY3VycmVudEVtYWlscyA9IEBtYXRyaXgubWFwICh1c2VyKSA9PiB1c2VyWzBdXG4gICAgbmV3RW1haWxzID0gZGlmZmVyZW5jZSBAZW1haWxzLCBjdXJyZW50RW1haWxzXG4gICAgbmV3RW1haWxzLmZvckVhY2ggKGVtYWlsKSA9PiBcbiAgICAgIEBtYXRyaXgucHVzaCBbIGVtYWlsLCBbXSBdXG4gICAgQG1hdHJpeC5mb3JFYWNoICh1c2VyKSA9PlxuICAgICAgZmlsZXMgPSB1c2VyWzFdXG4gICAgICBjdXJyZW50RmlsZXMgPSBmaWxlcy5tYXAgKGZpbGUpID0+IGZpbGVbMF1cbiAgICAgIG5ld0ZpbGVzID0gZGlmZmVyZW5jZSBAZmlsZXMsIGN1cnJlbnRGaWxlc1xuICAgICAgbmV3RmlsZXMuZm9yRWFjaCAoZmlsZSkgPT5cbiAgICAgICAgZmlsZXMucHVzaCBbIGZpbGUsIDAgXVxuXG4gIHNvcnQ6ICgpIC0+XG4gICAgQGZpbGVzID0gQGZpbGVzLnNvcnQoKVxuICAgIEBlbWFpbHMgPSBAZW1haWxzLnNvcnQoKVxuICAgIEBtYXRyaXggPSBzb3J0QnkgQG1hdHJpeCwgKHVzZXIpID0+IHVzZXJbMF1cbiAgICBAbWF0cml4ID0gQG1hdHJpeC5tYXAgKHVzZXIpID0+XG4gICAgICBbXG4gICAgICAgIHVzZXJbMF0sXG4gICAgICAgIHNvcnRCeSB1c2VyWzFdLCAoZmlsZSkgPT4gZmlsZVswXVxuICAgICAgXVxuXG5cbmVsTWFwID0gKHhzKSA9PiAoZikgPT4gKHhzLm1hcCBmKS5qb2luICdcXG4nXG5cblxubWF0cml4VG9IdG1sID0gKG1hdHJpeCAjIyM6IFVzZXJGaWxlQ2hhbmdlQ291bnRNYXRyaXggIyMjKSAjIyM6IHN0cmluZyAjIyMgPT5cbiAgZW1haWxzID0gZWxNYXAgbWF0cml4LmVtYWlsc1xuICBlbWFpbEhlYWRpbmdzID0gZW1haWxzIChlbWFpbCkgPT4gXCI8dGggc2NvcGU9J2NvbCc+I3tlbWFpbH08L3RoPlwiXG4gIHVzZXJzID0gZWxNYXAgbWF0cml4Lm1hdHJpeFxuICBmaWxlUm93cyA9IHVzZXJzICh1c2VyKSA9PlxuICAgIGZpbGVzID0gZWxNYXAgdXNlclsxXVxuICAgIGZpbGVzIChmaWxlLCBpKSA9PlxuICAgICAgZmlsZUNvbHMgPSB1c2VycyAodXNlcikgPT4gXCI8dGQ+I3t1c2VyWzFdW2ldWzFdfTwvdGQ+XCJcbiAgICAgIFwiXCJcIlxuICAgICAgPHRyPlxuICAgICAgICA8dGggc2NvcGU9J3Jvdyc+I3tmaWxlWzBdfTwvdGg+XG4gICAgICAgICN7ZmlsZUNvbHN9XG4gICAgICA8L3RyPlxuICAgICAgXCJcIlwiXG4gIFwiXCJcIlxuICA8dGFibGU+XG4gICAgPHRyPlxuICAgICAgPHRkPjwvdGQ+XG4gICAgICAje2VtYWlsSGVhZGluZ3N9XG4gICAgPC90cj5cbiAgICAje2ZpbGVSb3dzfVxuICA8L3RhYmxlPlxuICBcIlwiXCJcblxuXG5tYWluID0gKCkgPT5cbiAgY2hhbmdlc1Byb2MgPVxuICAgIHNwYXduICdnaXQnLFxuICAgICAgWyctLW5vLXBhZ2VyJywgJ2xvZycsICctLWZvcm1hdD0lbiVuJWN0ICVhZScsICctLW51bXN0YXQnLCAnLS1uby1tZXJnZXMnLCAnLS1uby1yZW5hbWVzJ10sXG4gICAgICB7IGVudjogeyAuLi5wcm9jZXNzLmVudiwgR0lUX0ZMVVNIOiAwIH0gfVxuICBjaGFuZ2VzUmF3U3RyZWFtID0gY2hhbmdlc1Byb2Muc3Rkb3V0XG4gIGNoYW5nZXNPYmplY3RTdHJlYW0gPSBuZXcgQ2hhbmdlc09iamVjdFN0cmVhbVxuICBjaGFuZ2VzUmF3U3RyZWFtLnBpcGUgY2hhbmdlc09iamVjdFN0cmVhbVxuICBtYXRyaXggPSBuZXcgVXNlckZpbGVDaGFuZ2VDb3VudE1hdHJpeFxuICBlbmQgPSBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgIGNoYW5nZXNPYmplY3RTdHJlYW0ub24gJ2RhdGEnLCAoY29tbWl0KSA9PiBtYXRyaXguYWRkQ29tbWl0IGNvbW1pdFxuICAgIGNoYW5nZXNQcm9jLm9uICdleGl0JywgKCkgPT5cbiAgICAgIG1hdHJpeC5zb3J0KClcbiAgICAgIGNvbnNvbGUubG9nIG1hdHJpeFRvSHRtbCBtYXRyaXhcbiAgICAgIHJlc29sdmUoKVxuXG4gIGF3YWl0IGVuZFxuXG5cbm1haW4oKSJdfQ==
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/index.coffee