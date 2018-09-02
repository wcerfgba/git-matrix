#!/usr/bin/env node
//!/usr/bin/env coffee
// @flow
var ChangeCountMatrix, ChangesObjectStream, CommitCountMatrix, GIT_CMD, GIT_SPAWN_CMD, Readable, UnknownMatrixError, argv, createReadStream, createWriteStream, exec, matrixToHtml, util, yargs;

yargs = require('yargs');

({Readable} = require('stream'));

({createReadStream, createWriteStream} = require('fs'));

({exec} = require('child_process'));

({UnknownMatrixError} = require('./errors'));

ChangesObjectStream = require('./ChangesObjectStream');

CommitCountMatrix = require('./CommitCountMatrix');

ChangeCountMatrix = require('./ChangeCountMatrix');

({matrixToHtml} = require('./renderMatrix'));

util = require('util');

exec = util.promisify(exec);

GIT_SPAWN_CMD = [
  'git',
  ['--no-pager',
  'log',
  '--format=%n%n%ct %ae',
  '--numstat',
  '--no-merges',
  '--no-renames'],
  {
    env: {
      ...process.env,
      GIT_FLUSH: 0
    }
  }
];

GIT_CMD = [
  'git --no-pager log --format="%n%n%ct %ae" --numstat --no-merges --no-renames',
  {
    env: {
      ...process.env,
      GIT_FLUSH: 0
    },
    maxBuffer: 2 * 1024 * 1024
  }
];

argv = yargs.option('i', {
  alias: 'input',
  describe: "Filename of input git log output. If not specified we execute the command in the working directory and pipe in the output.",
  type: 'string'
}).option('o', {
  alias: 'output',
  describe: "Output filename. If '-', we pipe to stdout.",
  type: 'string',
  defaultDescription: '"git-matrix.html" unless --only-log'
}).option('m', {
  alias: 'matrix',
  describe: "The function used to calculate the value for each file and user.",
  choices: ['commits', 'changes'],
  default: 'changes'
// .option 'c', {
//   alias: 'cooling'
//   describe: "Experimental cooling function where the scores in the matrix decrement over time."
//   type: 'number'
// }
}).option('l', {
  alias: 'only-log',
  describe: "Only gets the git log. Defaults output to stdout.",
  type: 'boolean'
}).argv;

(async() => {
  var commits, end, git, html, input, inputIsGit, matrix, output, outputIsNotStdout;
  if (!argv.output) {
    if (!argv['only-log']) {
      argv.output = 'git-matrix.html';
    }
  }
  outputIsNotStdout = argv.output && argv.output !== '-';
  if (argv.input) {
    input = createReadStream(argv.input);
  } else {
    inputIsGit = true;
    git = (await exec(...GIT_CMD));
    input = new Readable;
    input.push(git.stdout);
    input.push(null);
  }
  if (outputIsNotStdout) {
    // input = git.stdout
    output = createWriteStream(argv.output);
  }
  if (!outputIsNotStdout) {
    output = process.stdout;
  }
  input.pause();
  if (argv['only-log']) {
    input.pipe(output);
    input.resume();
  } else {
    commits = new ChangesObjectStream;
    input.pipe(commits);
    switch (argv.matrix) {
      case 'commits':
        matrix = CommitCountMatrix();
        break;
      case 'changes':
        matrix = ChangeCountMatrix();
        break;
      default:
        throw new UnknownMatrixError(argv.matrix);
    }
    end = new Promise((resolve, reject) => {
      commits.on('data', (commit) => {
        // console.log commit
        return matrix.addCommit(commit);
      });
      // console.log matrix
      return commits.on('finish', resolve);
    });
    input.resume();
    await end;
    matrix.sort();
    html = matrixToHtml(matrix);
    output.write(html);
  }
  if (outputIsNotStdout) {
    return output.destroy();
  }
})();

//# sourceMappingURL=index.js.map
