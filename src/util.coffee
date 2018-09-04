# @flow

{ inspect } = require 'util'
{ compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy } = require 'lodash'

floor = Math.floor

debug = (...xs) => console.debug inspect xs, { depth: null }

module.exports = { 
  debug
  compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy
  floor
}