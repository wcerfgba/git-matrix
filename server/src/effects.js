import * as effects from '../vendor/eyeson-common/lib/effects'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as FileLine from '../vendor/eyeson-common/lib/file_line'
import { range } from './utils'

export const Effect = {
  heatmap: (effect) => {
    switch (effect.effectType) {
      case 'VisibleFileEffect': return VisibleFileEffect.heatmap(effect)
      case 'CursorPositionEffect': return CursorPositionEffect.heatmap(effect)
      default: return null; // TODO: error handling!!!!!
    }
  }
}

export const VisibleFileEffect = {
  heatmap: (effect) => Heatmap.create(
    range(effect.viewportTopLine,
          effect.viewportBottomLine + 1)
      .map(lineNumber => [ FileLine.create({ ...effect, lineNumber }),
                           0.1 * (effect.toTime - effect.fromTime) ])
  )
}

export const CursorPositionEffect = {
  heatmap: (effect) => Heatmap.create([[
    FileLine.create({ ...effect, lineNumber: effect.cursorLine }),
    1.0 * (effect.toTime - effect.fromTime)
  ]])
}
