# @flow

yargs = require 'yargs'
{ createReadStream, createWriteStream } = require 'fs'
{ spawn } = require 'child_process'
{ UnknownMatrixError } = require './errors'
ChangesObjectStream = require './ChangesObjectStream'
CommitCountMatrix = require './CommitCountMatrix'
ChangeCountMatrix = require './ChangeCountMatrix'
{ matrixToHtml } = require './renderMatrix' 


GIT_LOG_SPAWN_ARGS = [
  'git',
  ['--no-pager', 'log', '--format=%n%n%ct %ae', '--numstat', '--no-merges', '--no-renames'],
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
    describe: "Output filename. If not specified, we pipe to stdout."
    type: 'string'
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
    describe: "Only gets the git log."
    type: 'boolean'
  }
  .argv

(() =>
  input = createReadStream argv.input if argv.input
  input = (spawn ...GIT_LOG_SPAWN_ARGS).stdout unless argv.input

  output = createWriteStream argv.output if argv.output
  output = process.stdout unless argv.output

  if argv['only-log']
    input.pipe output
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
      commits.on 'data', matrix.addCommit
      input.on 'end', resolve

    await end

    matrix.sort()
    html = matrixToHtml matrix

    output.write html

  output.destroy() if argv.output
)()