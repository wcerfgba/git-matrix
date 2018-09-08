{ assertExec, test, ls, cd } = require './support'

# fixtures = ls './test/fixtures/inputs'
# fixtures.forEach (fixture) =>
#   test "HTML no args - #{fixture}", () =>
#     cd "./test/fixtures/inputs/#{fixture}"
#     await exec "node ../../../lib/index.js"
#     diffExec = await exec "diff git-matrix.html ../outputs/#{fixture}.html"
#     diff = diffExec.stdout
#     diff == ''

test "HTML no args - vuetify", () =>
  cd "./test/fixtures/inputs/vuetify"
  assertExec "node ../../../../lib/index.js"
  assertExec "diff git-matrix.html ../outputs/vuetify.html"