"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Heatmap = void 0;

var _heatmap = require("../vendor/eyeson-common/lib/heatmap");

var _immutable = require("immutable");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Heatmap = {
  add: function add(a, b) {
    return (0, _immutable.Set)(_toConsumableArray(a.keys()).concat(_toConsumableArray(b.keys()))).reduce(function (sum, key) {
      return sum.set(key, (sum.get(key) || 0.0) + (a.get(key) || 0.0) + (b.get(key) || 0.0));
    }, _heatmap.Heatmap.new());
  }
};
exports.Heatmap = Heatmap;