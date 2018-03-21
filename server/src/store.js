// TODO: dynamodb
import * as Timeline from '../vendor/eyeson-common/lib/timeline'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'

export const create = () => { /* todo */ }

export const query = (store, query) => {
  return Timeline.create([
    VisibleFileEffect.create({
      fromTime: 10240000,
      toTime: 10240300,
      projectName: "eyeson",
      vcsReference: "<hash>",
      filePath: "scratch-1/src/core.clj",
      viewportTopLine: 1,
      viewportBottomLine: 200
    }),
    CursorPositionEffect.create({
      fromTime: 10240230,
      toTime: 10240300,
      projectName: "eyeson",
      vcsReference: "<hash>",
      filePath: "scratch-1/src/core.clj",
      cursorLine: 2,
      cursorColumn: 20
    }),
  ])
}