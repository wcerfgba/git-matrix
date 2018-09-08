{ AssertionError } = node_assert = require 'assert'
{ test } = mocha = require 'mocha'
{ ls, cd, exec } = shelljs = require 'shelljs'

assert = node_assert.strict

assertExec = (cmd, expectation = {}) =>
  expectation = Object.assign {
    code: 0
    stdout: ''
    stderr: ''
  }, expectation
  cmdExec = exec cmd
  assert.deepEqual {
    code: cmdExec.code
    stdout: cmdExec.stdout
    stderr: cmdExec.stderr
  }, expectation

# test = (name, predicate) =>
#   mocha.test name, () =>
#     throw new Error unless predicate()

# exec = (cmd) => shelljs.exec cmd, { async: true }

module.exports = {
  assert
  test
  ls, cd
  exec
  assertExec
}