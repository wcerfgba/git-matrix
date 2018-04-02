import * as Heatmap from '../heatmap'
import * as FileLine from '../file_line'
import { range } from '../utils'
import { Record } from 'immutable'

export { default as CursorPositionEffect } from './cursor_position_effect'

export const Effect = {
  defaultAttrs: {
    effectType: null,
    // TODO: store the time?
    fromTime: null,
    toTime: null,
    // TODO: fix File man!
    projectName: null,
    vcsReference: null,
  },
  
  is: (o) => (
    typeof o.effectType === 'string' &&
    typeof o.fromTime === 'number' &&
    typeof o.toTime === 'number' &&
    typeof o.projectName === 'string' &&
    typeof o.vcsReference === 'string' &&
    // Enforce strict subtyping
    (o.effectType === 'VisibleFileEffect' ||
     o.effectType === 'CursorPositionEffect')
  ),

  create: (o) => {
    switch (o.effectType) {
      case 'VisibleFileEffect': return VisibleFileEffect.create(o)
      case 'CursorPositionEffect': return CursorPositionEffect.create(o)
      default: return null; // TODO: error handling!!!!!
    }
  },

  heatmap: (effect) => {
    switch (effect.effectType) {
      case 'VisibleFileEffect': return VisibleFileEffect.heatmap(effect)
      case 'CursorPositionEffect': return CursorPositionEffect.heatmap(effect)
      default: return null; // TODO: error handling!!!!!
    }
  }
}

export const VisibleFileEffect = {
  is: (o) => (
    Effect.is(o) &&
    o.effectType === 'VisibleFileEffect' &&
    typeof o.filePath === 'string' &&
    typeof o.viewportTopLine === 'number' &&
    typeof o.viewportBottomLine === 'number'
  ),

  create: (o) => {
    return new (Record({
      ...Effect.create(o),
      effectType: 'VisibleFileEffect',
      filePath: o.filePath,
      viewportTopLine: o.viewportTopLine,
      viewportBottomLine: o.viewportBottomLine
    }))()
  },

  heatmap: (effect) => Heatmap.create({
    entries: range(effect.viewportTopLine,
                   effect.viewportBottomLine + 1)
              .map(lineNumber => [ lineNumber, 5.0 ])                           
  })
}