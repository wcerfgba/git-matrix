"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashCode = exports.equals = exports.is = exports.create = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// A FileLine provides all the information necessary to target a particular 
// line of a file. 
var create = function create(o) {
  return new (
  /*#__PURE__*/
  function () {
    function _class2() {
      _classCallCheck(this, _class2);

      Object.defineProperty(this, "projectName", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: o.projectName
      });
      Object.defineProperty(this, "vcsReference", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: o.vcsReference
      });
      Object.defineProperty(this, "filePath", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: o.filePath
      });
      Object.defineProperty(this, "lineNumber", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: o.lineNumber
      });
    }

    _createClass(_class2, [{
      key: "equals",
      value: function equals(other) {
        return _equals(this, other);
      }
    }, {
      key: "hashCode",
      value: function hashCode() {
        return _hashCode(this);
      }
    }]);

    return _class2;
  }())();
};

exports.create = create;

var is = function is(o) {
  return typeof o.projectName === 'string' && typeof o.vcsReference === 'string' && typeof o.filePath === 'string' && typeof o.lineNumber === 'number';
};

exports.is = is;

var _equals = function _equals(a, b) {
  return a.projectName === b.projectName && a.vcsReference === b.vcsReference && a.filePath === b.filePath && a.lineNumber === b.lineNumber;
}; // From https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0


exports.equals = _equals;

var _hashCode = function _hashCode(fileLine) {
  var s = JSON.stringify(fileLine);
  var h = 0,
      l = s.length,
      i = 0;
  if (l > 0) while (i < l) {
    h = (h << 5) - h + s.charCodeAt(i++) | 0;
  }
  return h;
};

exports.hashCode = _hashCode;