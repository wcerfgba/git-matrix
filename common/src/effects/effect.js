import * as CursorPositionEffect from './cursor_position_effect'
import * as VisibleFileEffect from './visible_file_effect'

export const defaultAttrs = {
  effectType: null,
  // TODO: store the time?
  fromTime: null,
  toTime: null,
  // TODO: fix File man!
  projectName: null,
  vcsReference: null,
}

export const create = (o) => {
  switch (o.effectType) {
    // TODO: dynamic dispatch!
    case 'VisibleFileEffect': return VisibleFileEffect.create(o)
    case 'CursorPositionEffect': return CursorPositionEffect.create(o)
    default: return null; // TODO: error handling!!!!!
  }
}

export const heatmap = (effect) => {
  switch (effect.effectType) {
    case 'VisibleFileEffect': return VisibleFileEffect.heatmap(effect)
    case 'CursorPositionEffect': return CursorPositionEffect.heatmap(effect)
    default: return null; // TODO: error handling!!!!!
  }
}
