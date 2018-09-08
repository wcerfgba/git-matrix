#!/usr/bin/env coffee
# @flow

yargs = require 'yargs'
{ Readable } = require 'stream'
{ createReadStream, createWriteStream } = require 'fs'
{ exec, spawn } = require 'child_process'
{ UnknownMatrixError } = require './errors'
ChangesObjectStream = require './ChangesObjectStream'
CommitCountMatrix = require './CommitCountMatrix'
ChangeCountMatrix = require './ChangeCountMatrix'
{ matrixToHtml } = require './renderMatrix'
{ onEnd } = require './util'

# git log command preformatted for spawn and exec.
GIT_SPAWN_CMD = [
  'git',
  ['--no-pager', 'log', '--format=%n%n%ct %cE', '--numstat', '--no-merges', '--no-renames'],
  { env: { GIT_FLUSH: 0 } }
]



(() =>
  argv = yargs
    .option 'i', {
      alias: 'input'
      describe: "Filename of input git log. If not specified we execute the command in the working directory."
      type: 'string'
    }
    .option 'o', {
      alias: 'output'
      describe: "Output filename. If '-' we pipe to stdout."
      type: 'string'
      defaultDescription: '"git-matrix.html" unless --only-log'
    }
    .option 'm', {
      alias: 'matrix'
      describe: "The function used to calculate the value of each cell."
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
      describe: "Only gets the git log, which can be read in with '-i'. Output defaults to stdout."
      type: 'boolean'
    }
    .argv

  # Set defaults
  if !argv.output
    argv.output = 'git-matrix.html' unless argv['only-log']

  outputIsStdout = !argv.output || argv.output == '-'
  inputIsGit = !argv.input
  onlyLog = argv['only-log']

  input = createReadStream argv.input unless inputIsGit
  input = (spawn ...GIT_SPAWN_CMD).stdout if inputIsGit
  
  # if argv.input
  #   input = createReadStream argv.input
  # else
  #   git = await spawnSync ...GIT_CMD
  #   # input = new Readable
  #   # input.push git.stdout
  #   # input.push null
  #   # input = git.stdout

  input.pause()

  output = createWriteStream argv.output unless outputIsStdout
  output = process.stdout if outputIsStdout

  if onlyLog
    input.pipe output

    end = Promise.all [
      onEnd input
      onEnd output
    ]

    input.resume()
    await end
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

    commits.on 'data', (commit) =>
      # console.log commits.totalBytesRead
      matrix.addCommit commit
      # console.log matrix

    end = Promise.all [
      onEnd input
      onEnd commits
    ]
    
    input.resume()
    await end

    # console.log matrix
    matrix.sort()
    # console.log matrix
    html = matrixToHtml matrix
    # console.log html
    await output.write html

  output.destroy() unless outputIsStdout
)()