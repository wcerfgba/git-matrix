import * as Effect from './effect'
import * as Heatmap from '../heatmap'
import { Record, Range } from 'immutable'

export const defaultAttrs = {
  ...Effect.defaultAttrs,
  effectType: 'VisibleFileEffect',
  filePath: null,
  viewportTopLine: null,
  viewportBottomLine: null
}
export const record = Record(defaultAttrs)

export const create = (o) => {
  return new record(o)
}

export const heatmap = (effect) => Heatmap.create({
  entries: Range(effect.viewportTopLine,
                  effect.viewportBottomLine + 1)
            .map(lineNumber => [ lineNumber, 5.0 ])                           
})