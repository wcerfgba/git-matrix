"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = exports.create = void 0;

var Timeline = _interopRequireWildcard(require("../vendor/eyeson-common/lib/timeline"));

var _effects = require("../vendor/eyeson-common/lib/effects");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// TODO: dynamodb
var create = function create() {
  /* todo */
};

exports.create = create;

var query = function query(store, _query) {
  return Timeline.create([_effects.VisibleFileEffect.create({
    viewportTopLine: 1,
    viewportBottomLine: 20
  }), _effects.CursorPositionEffect.create({
    cursorLine: 2,
    cursorColumn: 20
  })]);
};

exports.query = query;