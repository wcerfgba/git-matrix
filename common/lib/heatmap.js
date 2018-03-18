"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entries = exports.keys = exports.Heatmap = void 0;

var _immutable = require("immutable");

var Heatmap = function Heatmap() {
  var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (0, _immutable.Map)(entries);
};

exports.Heatmap = Heatmap;

var keys = function keys(heatmap) {
  return heatmap.keySeq().toArray();
};

exports.keys = keys;

var entries = function entries(heatmap) {
  return heatmap.entrySeq().toArray();
};

exports.entries = entries;