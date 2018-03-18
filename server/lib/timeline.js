"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timeline = void 0;

var _immutable = require("immutable");

var _heatmap2 = require("./heatmap");

var _add = require("./add");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Timeline =
/*#__PURE__*/
function () {
  function Timeline(entries) {
    _classCallCheck(this, Timeline);

    this.effects = (0, _immutable.List)(entries);
  }

  _createClass(Timeline, [{
    key: "heatmap",
    value: function heatmap() {
      return new _heatmap2.Heatmap(this.effects.map(_heatmap2.heatmap).reduce(_add.add));
    }
  }]);

  return Timeline;
}();

exports.Timeline = Timeline;