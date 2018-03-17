import { Timeline } from './timeline'
import { VisibleFileEffect, CursorPositionEffect } from './effects'
import { log } from './utils'

const getTimeline = () => new Timeline([
  new VisibleFileEffect({
    fromTime: 10240000,
    toTime: 10240300,
    projectName: "eyeson",
    vcsReference: "<hash>",
    filePath: "scratch-1/src/core.clj",
    viewportTopLine: 1,
    viewportBottomLine: 36
  }),
  new CursorPositionEffect({
    fromTime: 10240230,
    toTime: 10240300,
    projectName: "eyeson",
    vcsReference: "<hash>",
    filePath: "scratch-1/src/core.clj",
    cursorLine: 28,
    cursorColumn: 20
  }),
]);

log(getTimeline().heatmap())