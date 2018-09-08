# @flow

{ inspect } = require 'util'
{ compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy } = require 'lodash'

floor = Math.floor

debug = (...xs) => console.debug inspect xs, { depth: null }

onEnd = (readStream) => new Promise (resolve, reject) =>
  readStream.on 'end', () =>
    # console.log 'end'
    resolve()

module.exports = { 
  debug
  compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy
  floor
  onEnd
}