# @flow

{ inspect } = require 'util'
{ compact, last, difference, isEmpty, trim, union, sortBy } = require 'lodash'

debug = (...xs) => console.debug inspect xs, { depth: null }

module.exports = { 
  debug
  compact, last, difference, isEmpty, trim, union, sortBy
}