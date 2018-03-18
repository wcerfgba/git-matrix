"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileLine = void 0;

var _immutable = require("immutable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FileLine =
/*#__PURE__*/
function () {
  function FileLine(o) {
    _classCallCheck(this, FileLine);

    Object.defineProperty(this, "projectName", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "vcsReference", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "filePath", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lineNumber", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    });
    Object.assign(this, o);
  }

  _createClass(FileLine, [{
    key: "toObject",
    value: function toObject() {
      return this;
    }
  }, {
    key: "toImmutableMap",
    value: function toImmutableMap() {
      return (0, _immutable.Map)(this.toObject());
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return (0, _immutable.is)(this.toImmutableMap(), other.toImmutableMap());
    }
  }, {
    key: "hashCode",
    value: function hashCode() {
      return this.toImmutableMap().hashCode();
    }
  }]);

  return FileLine;
}();

exports.FileLine = FileLine;