import { newTimeline }             from './timeline';
import { newVisibleFileEffect,
         newCursorPositionEffect } from './effects';

const getTimeline = () => newTimeline({ effects: [
  newVisibleFileEffect({
    fromTime: 10240000,
    toTime: 10240300,
    projectName: "eyeson",
    vcsReference: "<hash>",
    filePath: "scratch-1/src/core.clj",
    viewportTopLine: 1,
    viewportBottomLine: 36
  }),
  newCursorPositionEffect({
    fromTime: 10240230,
    toTime: 10240300,
    projectName: "eyeson",
    vcsReference: "<hash>",
    filePath: "scratch-1/src/core.clj",
    cursorLine: 28,
    cursorColumn: 20
  }),
] });

console.log('%o', getTimeline().heatmap());