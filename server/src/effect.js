import { Map } from 'immutable'
import { VisibleFileEffect, CursorPositionEffect } from './effects'

export class Effect {
  static types = Map({
    'visible-file': VisibleFileEffect,
    'cursor-position': CursorPositionEffect
  })

  static new = (o) => new (Effect.types.get(o.effectType))(o)
}