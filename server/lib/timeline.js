"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmap = void 0;

var _immutable = require("immutable");

var Heatmap = _interopRequireWildcard(require("../vendor/eyeson-common/lib/heatmap"));

var _effects = require("../vendor/eyeson-common/lib/effects");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var heatmap = function heatmap(timeline) {
  return Heatmap.create(timeline.map(_effects.Effect.heatmap).reduce(Heatmap.add));
};

exports.heatmap = heatmap;