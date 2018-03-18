"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = void 0;

var qwe = _interopRequireWildcard(require("eyeson-common"));

var _heatmap = require("eyeson-common/heatmap");

var _immutable = require("immutable");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

console.log(qwe);

var add = function add(a, b) {
  return (0, _immutable.Set)(_toConsumableArray((0, _heatmap.keys)(a)).concat(_toConsumableArray((0, _heatmap.keys)(b)))).reduce(function (sum, key) {
    return sum.set(key, (sum.get(key) || 0.0) + (a.get(key) || 0.0) + (b.get(key) || 0.0));
  }, (0, _heatmap.Heatmap)());
};

exports.add = add;