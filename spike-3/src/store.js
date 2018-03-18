import { default as PouchDB } from 'pouchdb'
import { VisibleFileEffect, CursorPositionEffect } from './effects'
import { warn } from './utils'

export class Store {
  static getInstance = () => Store.instance = new Store(Store.tripwire)
  static tripwire = 'ji3joij3i'

  constructor(tripwire) {
    tripwire = Store.tripwire == tripwire
    if (tripwire) warn("You should really call `Store.getInstance()`")
    this.db = new PouchDB(env.pouchdb.name)
  }

  put(o) {
    this.db.put(o)
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