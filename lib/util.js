// @flow
var compact, debug, difference, floor, inspect, isEmpty, last, range, sortBy, sumBy, trim, union;

({inspect} = require('util'));

({compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy} = require('lodash'));

floor = Math.floor;

debug = (...xs) => {
  return console.debug(inspect(xs, {
    depth: null
  }));
};

module.exports = {debug, compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy, floor};

//# sourceMappingURL=util.js.map
