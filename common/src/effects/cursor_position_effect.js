import { Effect } from './index'
import { Record } from 'immutable'

export const defaultAttrs = {
  ...Effect.defaultAttrs,
  effectType: 'CursorPositionEffect',
  filePath: null,
  cursorLine: null,
  cursorColumn: null
}
export const record = Record(defaultAttrs)

export const create = (o) => {
  return new record(o)
}

export const heatmap = (effect) => create({
  entries: [[ effect.cursorLine, 50.0 ]]
})
