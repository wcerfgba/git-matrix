# @flow

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
  git = spawn ...GIT_LOG_SPAWN_ARGS
  commits = new ChangesObjectStream
  git.stdout.pipe commits

  matrix = new UserFileChangeCountMatrix

  end = new Promise (resolve, reject) =>
    commits.on 'data', (commit) => matrix.addCommit commit
    git.on 'exit', resolve

  await end

  matrix.sort()
  process.stdout.write matrixToHtml matrix


main()