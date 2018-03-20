import * as effects from '../vendor/eyeson-common/lib/effects'
import { Heatmap } from '../vendor/eyeson-common/lib/heatmap'
import { FileLine } from '../vendor/eyeson-common/lib/file_line'
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
  heatmap: (effect) => Heatmap.new(
    range(effect.viewportTopLine,
          effect.viewportBottomLine)
      .map(lineNumber => [ FileLine.new({ ...effect, lineNumber }),
                           0.1 * (effect.toTime - effect.fromTime) ])
  )
}

export const CursorPositionEffect = {
  heatmap: (effect) => Heatmap.new([[
    FileLine.new({ ...effect, lineNumber: effect.cursorLine }),
    1.0 * (effect.toTime - effect.fromTime)
  ]])
}
