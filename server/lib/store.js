"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;

var _pouchdb = _interopRequireDefault(require("pouchdb"));

var _effects = require("./effects");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Store =
/*#__PURE__*/
function () {
  function Store(tripwire) {
    _classCallCheck(this, Store);

    tripwire = Store.tripwire == tripwire;
    if (tripwire) (0, _utils.warn)("You should really call `Store.getInstance()`");
    this.db = new _pouchdb.default(env.pouchdb.name);
  }

  _createClass(Store, [{
    key: "put",
    value: function put(o) {
      this.db.put(o);
    }
  }, {
    key: "query",
    value: function query(_query) {
      return [new _effects.VisibleFileEffect({
        fromTime: 10240000,
        toTime: 10240300,
        projectName: "eyeson",
        vcsReference: "<hash>",
        filePath: "scratch-1/src/core.clj",
        viewportTopLine: 1,
        viewportBottomLine: 36
      }), new _effects.CursorPositionEffect({
        fromTime: 10240230,
        toTime: 10240300,
        projectName: "eyeson",
        vcsReference: "<hash>",
        filePath: "scratch-1/src/core.clj",
        cursorLine: 28,
        cursorColumn: 20
      })];
    }
  }]);

  return Store;
}();

exports.Store = Store;
Object.defineProperty(Store, "getInstance", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function value() {
    return Store.instance = new Store(Store.tripwire);
  }
});
Object.defineProperty(Store, "tripwire", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: 'ji3joij3i'
});