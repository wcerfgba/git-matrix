// TODO: dynamodb
import { Timeline } from '../vendor/eyeson-common/lib/timeline'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'

export const Store = {
  new: () => { /* todo */ },
  query: (store, query) => {
    return Timeline.new([
      VisibleFileEffect.new({
        fromTime: 10240000,
        toTime: 10240300,
        projectName: "eyeson",
        vcsReference: "<hash>",
        filePath: "scratch-1/src/core.clj",
        viewportTopLine: 1,
        viewportBottomLine: 36
      }),
      CursorPositionEffect.new({
        fromTime: 10240230,
        toTime: 10240300,
        projectName: "eyeson",
        vcsReference: "<hash>",
        filePath: "scratch-1/src/core.clj",
        cursorLine: 28,
        cursorColumn: 20
      }),
    ])
  }
}
