"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _store = require("./store");

var _effect = require("./effect");

var _timeline = require("./timeline");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = _store.Store.getInstance();

var app = (0, _express.default)();
app.use(_bodyParser.default.json());
app.post('/effects', function (req, res) {
  try {
    var effects = JSON.parse(req.body);
    assert(typeof effects === 'array', "Expected array of effect objects");
    effects.map(_effect.Effect.new).forEach(function (effect) {
      return store.put(effect);
    });
    res.status(200);
  } catch (e) {
    res.status(400).json({
      err: e.message
    });
  }
});
app.get('/heatmap', function (req, res) {
  var timeline = new _timeline.Timeline(store.query({
    and: req.params
  }));
  res.status(200).send(timeline.heatmap().toJSON());
});
app.listen(3000);