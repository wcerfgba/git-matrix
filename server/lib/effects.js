"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CursorPositionEffect = exports.VisibleFileEffect = void 0;

var _heatmap = require("./heatmap");

var _file_line = require("./file_line");

var _utils = require("./utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VisibleFileEffect =
/*#__PURE__*/
function () {
  function VisibleFileEffect(o) {
    _classCallCheck(this, VisibleFileEffect);

    (0, _utils.assignKeys)(VisibleFileEffect.keys, o, this);
  }

  _createClass(VisibleFileEffect, [{
    key: "heatmap",
    value: function heatmap() {
      var _this = this;

      return new _heatmap.Heatmap((0, _utils.range)(this.viewportTopLine, this.viewportBottomLine).map(function (lineNumber) {
        return [new _file_line.FileLine(_objectSpread({}, _this, {
          lineNumber: lineNumber
        })), 0.1 * (_this.toTime - _this.fromTime)];
      }));
    }
  }]);

  return VisibleFileEffect;
}();

exports.VisibleFileEffect = VisibleFileEffect;
Object.defineProperty(VisibleFileEffect, "keys", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ['fromTime', 'toTime', 'projectName', 'vcsReference', 'filePath', 'viewportTopLine', 'viewportBottomLine']
});

var CursorPositionEffect =
/*#__PURE__*/
function () {
  function CursorPositionEffect(o) {
    _classCallCheck(this, CursorPositionEffect);

    (0, _utils.assignKeys)(CursorPositionEffect.keys, o, this);
  }

  _createClass(CursorPositionEffect, [{
    key: "heatmap",
    value: function heatmap() {
      return new _heatmap.Heatmap([[new _file_line.FileLine(_objectSpread({}, this, {
        lineNumber: this.cursorLine
      })), 1.0 * (this.toTime - this.fromTime)]]);
    }
  }]);

  return CursorPositionEffect;
}();

exports.CursorPositionEffect = CursorPositionEffect;
Object.defineProperty(CursorPositionEffect, "keys", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ['fromTime', 'toTime', 'projectName', 'vcsReference', 'filePath', 'cursorLine', 'cursorColumn']
});