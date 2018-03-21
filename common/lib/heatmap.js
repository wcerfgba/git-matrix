"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = exports.get = exports.entries = exports.fileLines = exports.is = exports.create = void 0;

var _immutable = require("immutable");

var FileLine = _interopRequireWildcard(require("./file_line"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var create = function create() {
  var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (0, _immutable.Map)(entries);
};

exports.create = create;

var is = function is(o) {
  return _immutable.Map.isMap(o) && o.entries().map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return FileLine.is(k) && typeof v === 'number';
  }).reduce(function (a, b) {
    return a && b;
  });
};

exports.is = is;

var fileLines = function fileLines(heatmap) {
  return heatmap.keySeq().toArray();
};

exports.fileLines = fileLines;

var entries = function entries(heatmap) {
  return heatmap.entrySeq().toArray();
};

exports.entries = entries;

var get = function get(heatmap, k) {
  return heatmap.get(k) || 0.0;
};

exports.get = get;

var set = function set(heatmap, k, v) {
  return heatmap.set(k, v);
};

exports.set = set;