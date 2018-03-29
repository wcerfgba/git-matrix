"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = exports.is = exports.create = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// A FileLine provides all the information necessary to target a particular 
// line of a file. 
var create = function create() {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
      value: function (_hashCode) {
        function hashCode() {
          return _hashCode.apply(this, arguments);
        }

        hashCode.toString = function () {
          return _hashCode.toString();
        };

        return hashCode;
      }(function () {
        return hashCode(this);
      })
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
};

exports.equals = _equals;