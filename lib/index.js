#!/usr/bin/env node
//!/usr/bin/env coffee
// @flow
var ChangeCountMatrix, ChangesObjectStream, CommitCountMatrix, GIT_SPAWN_CMD, Readable, UnknownMatrixError, createReadStream, createWriteStream, exec, matrixToHtml, onEnd, spawn, yargs;

yargs = require('yargs');

({Readable} = require('stream'));

({createReadStream, createWriteStream} = require('fs'));

({exec, spawn} = require('child_process'));

({UnknownMatrixError} = require('./errors'));

ChangesObjectStream = require('./ChangesObjectStream');

CommitCountMatrix = require('./CommitCountMatrix');

ChangeCountMatrix = require('./ChangeCountMatrix');

({matrixToHtml} = require('./renderMatrix'));

({onEnd} = require('./util'));

// git log command preformatted for spawn and exec.
GIT_SPAWN_CMD = [
  'git',
  ['--no-pager',
  'log',
  '--format=%n%n%ct %cE',
  '--numstat',
  '--no-merges',
  '--no-renames'],
  {
    env: {
      GIT_FLUSH: 0
    }
  }
];

(async() => {
  var argv, commits, end, html, input, inputIsGit, matrix, onlyLog, output, outputIsStdout;
  argv = yargs.option('i', {
    alias: 'input',
    describe: "Filename of input git log. If not specified we execute the command in the working directory.",
    type: 'string'
  }).option('o', {
    alias: 'output',
    describe: "Output filename. If '-' we pipe to stdout.",
    type: 'string',
    defaultDescription: '"git-matrix.html" unless --only-log'
  }).option('m', {
    alias: 'matrix',
    describe: "The function used to calculate the value of each cell.",
    choices: ['commits', 'changes'],
    default: 'changes'
  // .option 'c', {
  //   alias: 'cooling'
  //   describe: "Experimental cooling function where the scores in the matrix decrement over time."
  //   type: 'number'
  // }
  }).option('l', {
    alias: 'only-log',
    describe: "Only gets the git log, which can be read in with '-i'. Output defaults to stdout.",
    type: 'boolean'
  }).argv;
  if (!argv.output) {
    if (!argv['only-log']) {
      argv.output = 'git-matrix.html';
    }
  }
  outputIsStdout = !argv.output || argv.output === '-';
  inputIsGit = !argv.input;
  onlyLog = argv['only-log'];
  if (!inputIsGit) {
    input = createReadStream(argv.input);
  }
  if (inputIsGit) {
    input = (spawn(...GIT_SPAWN_CMD)).stdout;
  }
  
  // if argv.input
  //   input = createReadStream argv.input
  // else
  //   git = await spawnSync ...GIT_CMD
  //   # input = new Readable
  //   # input.push git.stdout
  //   # input.push null
  //   # input = git.stdout
  input.pause();
  if (!outputIsStdout) {
    output = createWriteStream(argv.output);
  }
  if (outputIsStdout) {
    output = process.stdout;
  }
  if (onlyLog) {
    input.pipe(output);
    end = Promise.all([onEnd(input), onEnd(output)]);
    input.resume();
    await end;
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
    commits.on('data', (commit) => {
      // console.log commits.totalBytesRead
      return matrix.addCommit(commit);
    });
    // console.log matrix
    end = Promise.all([onEnd(input), onEnd(commits)]);
    input.resume();
    await end;
    // console.log matrix
    matrix.sort();
    // console.log matrix
    html = matrixToHtml(matrix);
    // console.log html
    await output.write(html);
  }
  if (!outputIsStdout) {
    return output.destroy();
  }
})();
