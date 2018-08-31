# @flow

yargs = require 'yargs'
{ createReadStream, createWriteStream } = require 'fs'
{ spawn } = require 'child_process'
ChangesObjectStream = require './ChangesObjectStream'
UserFileChangeCountMatrix = require './UserFileChangeCountMatrix'
{ matrixToHtml } = require './renderMatrix' 

GIT_LOG_SPAWN_ARGS = [
  'git',
  ['--no-pager', 'log', '--format=%n%n%ct %ae', '--numstat', '--no-merges', '--no-renames'],
  { env: { ...process.env, GIT_FLUSH: 0 } }
]

main = () =>
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
    .argv

  input = createReadStream argv.i if argv.i
  input = (spawn ...GIT_LOG_SPAWN_ARGS).stdout unless argv.i

  commits = new ChangesObjectStream
  input.pipe commits

  matrix = new UserFileChangeCountMatrix

  end = new Promise (resolve, reject) =>
    commits.on 'data', matrix.addCommit
    input.on 'end', resolve

  await end

  matrix.sort()
  html = matrixToHtml matrix

  output = createWriteStream argv.o if argv.o
  output = process.stdout unless argv.o

  output.write html

  output.destroy() if argv.o


main()