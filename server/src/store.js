// TODO: dynamodb
import * as Timeline from '../vendor/eyeson-common/lib/timeline'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'

export const create = () => { /* todo */ }

export const query = (store, query) => {
  return Timeline.create([
    VisibleFileEffect.create({
      viewportTopLine: 1,
      viewportBottomLine: 200
    }),
    CursorPositionEffect.create({
      cursorLine: 2,
      cursorColumn: 20
    }),
  ])
}