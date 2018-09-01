class GitMatrixError extends Error
  constructor: (message) ->
    super message

UnknownMatrixError = (matrix) ->
  new GitMatrixError """Unknown matrix: #{matrix}"""

module.exports = {
  GitMatrixError
  UnknownMatrixError
}