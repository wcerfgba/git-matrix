import * as Heatmap from './heatmap'
import * as FileLine from './file_line'
import { range } from './utils'

export const Effect = {
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

  create: (o) => ({
    effectType: o.effectType,
    fromTime: o.fromTime,
    toTime: o.toTime,
    projectName: o.projectName,
    vcsReference: o.vcsReference
  }),

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

  create: (o) => ({
    ...Effect.create(o),
    effectType: 'VisibleFileEffect',
    filePath: o.filePath,
    viewportTopLine: o.viewportTopLine,
    viewportBottomLine: o.viewportBottomLine
  }),

  heatmap: (effect) => Heatmap.create(
    range(effect.viewportTopLine,
          effect.viewportBottomLine + 1)
      .map(lineNumber => [ FileLine.create({ ...effect, lineNumber }),
                           0.01 * (effect.toTime - effect.fromTime) ])
  )
}

export const CursorPositionEffect = {
  is: (o) => (
    Effect.is(o) &&
    o.effectType === 'CursorPositionEffect' &&
    typeof o.filePath === 'string' &&
    typeof o.cursorLine === 'number' &&
    typeof o.cursorColumn === 'number'
  ),

  create: (o) => ({
    ...Effect.create(o),
    effectType: 'CursorPositionEffect',
    filePath: o.filePath,
    cursorLine: o.cursorLine,
    cursorColumn: o.cursorColumn
  }),

  heatmap: (effect) => Heatmap.create([[
    FileLine.create({ ...effect, lineNumber: effect.cursorLine }),
    0.01 * (effect.toTime - effect.fromTime)
  ]])
}
