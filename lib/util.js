// @flow
var compact, debug, difference, floor, inspect, isEmpty, last, onEnd, range, sortBy, sumBy, trim, union;

({inspect} = require('util'));

({compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy} = require('lodash'));

floor = Math.floor;

debug = (...xs) => {
  return console.debug(inspect(xs, {
    depth: null
  }));
};

onEnd = (readStream) => {
  return new Promise((resolve, reject) => {
    return readStream.on('end', () => {
      console.log('end');
      return resolve();
    });
  });
};

module.exports = {debug, compact, last, difference, isEmpty, trim, union, sortBy, range, sumBy, floor, onEnd};
