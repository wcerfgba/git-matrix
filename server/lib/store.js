"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;

var _timeline = require("../vendor/eyeson-common/lib/timeline");

var _effects = require("../vendor/eyeson-common/lib/effects");

// TODO: dynamodb
var Store = {
  new: function _new() {
    /* todo */
  },
  query: function query(store, _query) {
    return _timeline.Timeline.new([_effects.VisibleFileEffect.new({
      fromTime: 10240000,
      toTime: 10240300,
      projectName: "eyeson",
      vcsReference: "<hash>",
      filePath: "scratch-1/src/core.clj",
      viewportTopLine: 1,
      viewportBottomLine: 36
    }), _effects.CursorPositionEffect.new({
      fromTime: 10240230,
      toTime: 10240300,
      projectName: "eyeson",
      vcsReference: "<hash>",
      filePath: "scratch-1/src/core.clj",
      cursorLine: 28,
      cursorColumn: 20
    })]);
  }
};
exports.Store = Store;