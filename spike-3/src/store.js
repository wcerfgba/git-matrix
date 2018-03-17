import { VisibleFileEffect, CursorPositionEffect } from './effects'

export class Store {
  static getInstance = () => Store.instance = new Store()

  put(o) {
    return true
  }

  query(query) {
    return [
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
    ]
  }
}