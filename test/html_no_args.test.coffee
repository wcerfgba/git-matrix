{ assertExec, test, ls, cd, rm } = require './support'

# fixtures = ls './test/fixtures/inputs'
# fixtures.forEach (fixture) =>

test "HTML no args - vuetify", () =>
  cd "./test/fixtures/inputs/vuetify"
  assertExec "node ../../../../lib/index.js"
  assertExec "diff git-matrix.html ../../outputs/vuetify.html"
  rm "git-matrix.html"