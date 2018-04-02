// TODO: an actual persistence layer (in git? :DDD)
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'

export const create = () => { /* todo */ }

export const query = (store, query) => {
  return Heatmap.create({
    filePath: '/home/jpreston/Sync/notes/movies.jf',
    time: 123123123,
    entries: [
      [2, 500.0]
    ]
  })
}