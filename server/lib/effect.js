"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Effect = void 0;

var _immutable = require("immutable");

var _effects = require("./effects");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Effect = function Effect() {
  _classCallCheck(this, Effect);
};

exports.Effect = Effect;
Object.defineProperty(Effect, "types", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: (0, _immutable.Map)({
    'visible-file': _effects.VisibleFileEffect,
    'cursor-position': _effects.CursorPositionEffect
  })
});
Object.defineProperty(Effect, "new", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function value(o) {
    return new (Effect.types.get(o.effectType))(o);
  }
});