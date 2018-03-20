"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timeline = void 0;

var _immutable = require("immutable");

var _heatmap = require("../vendor/eyeson-common/lib/heatmap");

var _heatmap2 = require("./heatmap");

var _effects = require("./effects");

var Timeline = {
  heatmap: function heatmap(timeline) {
    return _heatmap.Heatmap.new(timeline.map(_effects.Effect.heatmap).reduce(_heatmap2.Heatmap.add));
  }
};
exports.Timeline = Timeline;