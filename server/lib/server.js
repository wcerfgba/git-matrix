"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = exports.start = exports.create = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var Store = _interopRequireWildcard(require("./store"));

var _Timeline = _interopRequireWildcard(require("../vendor/eyeson-common/lib/timeline"));

var Timeline = _interopRequireWildcard(require("./timeline"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { Effect } from '../vendor/eyeson-common/lib/effects'
var create = function create(_ref) {
  var _ref$logger = _ref.logger,
      logger = _ref$logger === void 0 ? function () {} : _ref$logger,
      port = _ref.port;
  var app = (0, _express.default)();
  var store = Store.create();
  app.use(_bodyParser.default.json());
  app.post('/effects', function (req, res) {
    try {
      var effects = JSON.parse(req.body); // ....

      res.status(200);
    } catch (e) {
      res.status(400).json({
        err: e.message
      });
    }
  });
  app.get('/heatmap', function (req, res) {
    logger(req); // TODO: lele how do i async

    var timeline = _Timeline.create(Store.query(store, {
      and: req.params
    }));

    logger(req, timeline);
    var heatmap = Timeline.heatmap(timeline).entrySeq().toArray();
    logger(req, heatmap);
    res.status(200).send(JSON.stringify(heatmap, null, 2));
  });

  app.start = function () {
    return app.listen(port);
  };

  return app;
};

exports.create = create;

var start = function start(server) {
  return server.start();
};

exports.start = start;

var stop = function stop(server) {
  /* wtf express? */
};

exports.stop = stop;