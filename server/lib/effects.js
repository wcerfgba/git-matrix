"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CursorPositionEffect = exports.VisibleFileEffect = exports.Effect = void 0;

var effects = _interopRequireWildcard(require("../vendor/eyeson-common/lib/effects"));

var _heatmap = require("../vendor/eyeson-common/lib/heatmap");

var _file_line = require("../vendor/eyeson-common/lib/file_line");

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Effect = {
  heatmap: function heatmap(effect) {
    switch (effect.effectType) {
      case 'VisibleFileEffect':
        return VisibleFileEffect.heatmap(effect);

      case 'CursorPositionEffect':
        return CursorPositionEffect.heatmap(effect);

      default:
        return null;
      // TODO: error handling!!!!!
    }
  }
};
exports.Effect = Effect;
var VisibleFileEffect = {
  heatmap: function heatmap(effect) {
    return _heatmap.Heatmap.new((0, _utils.range)(effect.viewportTopLine, effect.viewportBottomLine).map(function (lineNumber) {
      return [_file_line.FileLine.new(_objectSpread({}, effect, {
        lineNumber: lineNumber
      })), 0.1 * (effect.toTime - effect.fromTime)];
    }));
  }
};
exports.VisibleFileEffect = VisibleFileEffect;
var CursorPositionEffect = {
  heatmap: function heatmap(effect) {
    return _heatmap.Heatmap.new([[_file_line.FileLine.new(_objectSpread({}, effect, {
      lineNumber: effect.cursorLine
    })), 1.0 * (effect.toTime - effect.fromTime)]]);
  }
};
exports.CursorPositionEffect = CursorPositionEffect;