"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = exports.add = exports.set = exports.get = exports.entries = exports.lineNumbers = exports.is = exports.toJSON = exports.create = void 0;

var _immutable = require("immutable");

var FileLine = _interopRequireWildcard(require("./file_line"));

var _logging = require("./logging");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var create = function create() {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var heatmap = {
    // Map from line number to heat quantity
    entries: cleanEntries(o.entries),
    time: o.time || Date.now(),
    // Arbitrary reference at each end (repo name)
    projectName: o.projectName,
    // Something usable by the project's configured VCS to determine a set of 
    // files. We may want to look at the diff with the next revision after 
    // this one when determining which lines have received effects.
    vcsReference: o.vcsReference,
    // Relative to project root.
    filePath: o.filePath
  };

  heatmap.toJSON = function () {
    return toJSON(heatmap);
  };

  return heatmap;
};

exports.create = create;

var cleanEntries = function cleanEntries(entries) {
  entries = entries || [];
  entries = (0, _immutable.Map)(entries);
  entries = entries.entrySeq().toArray();
  entries = entries.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        lineNumber = _ref2[0],
        heatQuantity = _ref2[1];

    return [Number(lineNumber), Number(heatQuantity)];
  });
  entries = (0, _immutable.Map)(entries);
  return entries;
};

var toJSON = function toJSON(heatmap) {
  var json = _objectSpread({}, heatmap, {
    entries: entries(heatmap)
  });

  delete json.toJSON;
  return json;
};

exports.toJSON = toJSON;

var is = function is(o) {
  return _immutable.Map.isMap(o.entries) && entries(o).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        lineNumber = _ref4[0],
        heatQuantity = _ref4[1];

    return typeof lineNumber === 'number' && typeof heatQuantity === 'number';
  }).reduce(function (a, b) {
    return a && b;
  }) && typeof o.time === 'number' && // typeof o.projectName === 'string' &&
  // typeof o.vcsReference === 'string' &&
  typeof o.filePath === 'string';
};

exports.is = is;

var lineNumbers = function lineNumbers(heatmap) {
  return heatmap.entries.keySeq().toArray();
};

exports.lineNumbers = lineNumbers;

var entries = function entries(heatmap) {
  return heatmap.entries.entrySeq().toArray();
};

exports.entries = entries;

var get = function get(heatmap, lineNumber) {
  return heatmap.entries.get(lineNumber) || 0.0;
};

exports.get = get;

var set = function set(heatmap, lineNumber, heatQuantity) {
  heatmap.entries = heatmap.entries.set(lineNumber, heatQuantity);
  return heatmap;
};

exports.set = set;

var add = function add(a, b) {
  return (0, _immutable.Set)(_toConsumableArray(lineNumbers(a)).concat(_toConsumableArray(lineNumbers(b)))).reduce(function (sum, lineNumber) {
    return set(sum, lineNumber, get(sum, lineNumber) + get(a, lineNumber) + get(b, lineNumber));
  }, // Inherit attributes from first argument, but start with an empty entry-set
  create(_objectSpread({}, a, {
    entries: []
  })));
};

exports.add = add;

var map = function map(heatmap, f) {
  (0, _logging.logMethod)('Heatmap.map');
  var originalEntries = entries(heatmap);
  (0, _logging.log)('originalEntries', originalEntries);
  var mappedEntries = originalEntries.map(f);
  (0, _logging.log)('mappedEntries', mappedEntries);
  var newHeatmap = create(_objectSpread({}, heatmap, {
    entries: mappedEntries
  }));
  (0, _logging.logReturn)(newHeatmap);
  return newHeatmap;
};

exports.map = map;