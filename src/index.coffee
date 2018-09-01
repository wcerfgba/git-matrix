#!/usr/bin/env coffee
# @flow

yargs = require 'yargs'
{ Readable } = require 'stream'
{ createReadStream, createWriteStream } = require 'fs'
{ exec } = require 'child_process'
{ UnknownMatrixError } = require './errors'
ChangesObjectStream = require './ChangesObjectStream'
CommitCountMatrix = require './CommitCountMatrix'
ChangeCountMatrix = require './ChangeCountMatrix'
{ matrixToHtml } = require './renderMatrix' 



util = require('util')
exec = util.promisify(exec)



GIT_SPAWN_CMD = [
  'git',
  ['--no-pager', 'log', '--format=%n%n%ct %ae', '--numstat', '--no-merges', '--no-renames'],
  { env: { ...process.env, GIT_FLUSH: 0 } }
]

GIT_CMD = [
  'git --no-pager log --format="%n%n%ct %ae" --numstat --no-merges --no-renames',
  { env: { ...process.env, GIT_FLUSH: 0 } }
]


argv = yargs
  .option 'i', {
    alias: 'input'
    describe: "Filename of input git log output. If not specified we execute the command in the working directory and pipe in the output."
    type: 'string'
  }
  .option 'o', {
    alias: 'output'
    describe: "Output filename. If '-', we pipe to stdout."
    type: 'string'
    defaultDescription: '"git-matrix.html" unless --only-log'
  }
  .option 'm', {
    alias: 'matrix'
    describe: "The function used to calculate the value for each file and user."
    choices: ['commits', 'changes'],
    default: 'changes'
  }
  # .option 'c', {
  #   alias: 'cooling'
  #   describe: "Experimental cooling function where the scores in the matrix decrement over time."
  #   type: 'number'
  # }
  .option 'l', {
    alias: 'only-log',
    describe: "Only gets the git log. Defaults output to stdout."
    type: 'boolean'
  }
  .argv

(() =>
  if !argv.output
    argv.output = 'git-matrix.html' unless argv['only-log']

  outputIsNotStdout = argv.output && argv.output != '-'

  if argv.input
    input = createReadStream argv.input
  else
    inputIsGit = true
    git = await exec ...GIT_CMD
    input = new Readable
    input.push git.stdout
    input.push null
    # input = git.stdout

  output = createWriteStream argv.output if outputIsNotStdout
  output = process.stdout unless outputIsNotStdout

  input.pause()

  if argv['only-log']
    input.pipe output
    input.resume()
  else
    commits = new ChangesObjectStream
    input.pipe commits

    switch argv.matrix
      when 'commits'
        matrix = CommitCountMatrix()
      when 'changes'
        matrix = ChangeCountMatrix()
      else
        throw new UnknownMatrixError argv.matrix

    end = new Promise (resolve, reject) =>
      commits.on 'data', (commit) =>
        # console.log commit
        matrix.addCommit commit
      input.on 'end', resolve

    input.resume()
    await end

    matrix.sort()
    html = matrixToHtml matrix

    output.write html

  output.destroy() if outputIsNotStdout
)()