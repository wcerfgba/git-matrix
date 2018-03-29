"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmap = exports.is = exports.create = void 0;

var _immutable = require("immutable");

var Heatmap = _interopRequireWildcard(require("../vendor/eyeson-common/lib/heatmap"));

var HeatmapSimulation = _interopRequireWildcard(require("../vendor/eyeson-common/lib/heatmap_simulation"));

var _effects = require("../vendor/eyeson-common/lib/effects");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var create = function create(entries) {
  return entries;
};

exports.create = create;

var is = function is(o) {
  return Array.isArray(o) && o.map(_effects.Effect.is).reduce(function (a, b) {
    return a && b;
  });
};

exports.is = is;

var heatmap = function heatmap(timeline) {
  var time = 10240000;
  var simulation = HeatmapSimulation.create({
    heatmap: Heatmap.create({
      projectName: '',
      vcsReference: '',
      filePath: '/home/jpreston/Sync/notes/movies.jf',
      time: time
    }),
    activeEffects: timeline
  }); // TODO: pure methods lel

  HeatmapSimulation.iterateToTime(simulation, time + 5000);
  return simulation.heatmap;
};

exports.heatmap = heatmap;