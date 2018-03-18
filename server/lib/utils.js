"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integrate = exports.range = exports.assert = exports.assignKeys = exports.getMany = exports.assertKeys = exports.log = void 0;

var _immutable = require("immutable");

var log = function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  args.map(function (a) {
    return console.log(a.toJSON());
  });
  return args;
};

exports.log = log;

var assertKeys = function assertKeys(ks, o) {
  ks = (0, _immutable.List)(ks);
  o = (0, _immutable.Map)(o);
  assert(ks.isSubset(o.keySeq()), "Object ");
};

exports.assertKeys = assertKeys;

var getMany = function getMany(ks, o) {
  return (0, _immutable.Map)(ks.map(function (k) {
    return [k, o[k]];
  })).toObject();
};

exports.getMany = getMany;

var assignKeys = function assignKeys(ks, o, target) {
  assertKeys(ks, o);
  Object.assign(target, getMany(ks, o));
};

exports.assignKeys = assignKeys;

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

var integrate = function integrate(f, tStart, tEnd, _ref) {
  var _ref$decay = _ref.decay,
      decay = _ref$decay === void 0 ? 1.0 : _ref$decay,
      _ref$timestep = _ref.timestep,
      timestep = _ref$timestep === void 0 ? 0.001 : _ref$timestep;
  return range(tStart, tEnd, timestep).reduce(function (sum, tNext) {
    return decay * sum + timestep * f(tNext);
  }, 0.0);
};

exports.integrate = integrate;