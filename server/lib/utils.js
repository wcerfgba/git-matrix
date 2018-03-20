"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = exports.assert = exports.warn = exports.log = void 0;
var log = console.log;
exports.log = log;
var warn = console.warn;
exports.warn = warn;

var assert = function assert(p, m) {
  if (p) {
    return p;
  }

  throw new Error(m);
};

exports.assert = assert;

var range = function range(from, to) {
  var incr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var incrFun = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (x) {
    return x + incr;
  };
  var range = [];

  for (var next = from; next < to; next = incrFun(next)) {
    range.push(next);
  }

  return range;
};

exports.range = range;