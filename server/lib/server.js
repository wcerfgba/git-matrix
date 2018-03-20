"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _store = require("./store");

var _timeline = require("../vendor/eyeson-common/lib/timeline");

var _timeline2 = require("./timeline");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { Effect } from '../vendor/eyeson-common/lib/effects'
var store = _store.Store.new();

var app = (0, _express.default)();
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
  // TODO: lele how do i async
  var timeline = _timeline.Timeline.new(_store.Store.query(store, {
    and: req.params
  }));

  res.status(200).send(JSON.stringify(_timeline2.Timeline.heatmap(timeline)));
});
app.listen(3000);