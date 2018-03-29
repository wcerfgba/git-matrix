import { Effect } from '../vendor/eyeson-common/lib/effects'
import { on, fire } from '../vendor/eyeson-common/lib/event_listener'
import { Set } from 'immutable'
import { assert, isFalsey } from '../vendor/eyeson-common/lib/utils'

export const create = (o = {}) => {
  const effectsHandler = {
    effects: Set(o.effects || []),
    iterateInterval: 1000,
    iterateIntervalID: null,
    effectTimestep: 1,
    eventListeners: []
  }
  return effectsHandler
}

export const getActiveEffects = (effectsHandler) => {
  return effectsHandler.effects
    .filter(entry => entry.isActive)
    .map(entry => entry.effect)
}

// TODO: handle creation and finalization of effects due to events

// and make a pseudoevent for visibe lines (poll D:)
// TODO: this is hw we get the lines boiiiii
//   console.log(heatmapUIHandler.editorHandler.activeEditor._visibleRanges)

export const startIterate = (effectsHandler) => {
  assert(isFalsey(effectsHandler.iterateIntervalID), "Already iterating, use 'EffectsHandler.stopIterate' first.")
  effectsHandler.iterateIntervalID =
    setInterval(() => iterate(effectsHandler), effectsHandler.iterateInterval)
}

// TODO: stopIterate

export const iterate = (effectsHandler) => {
  const iterateEffect = (effect) => {
    return {
      ...effect,
      toTime: effect.toTime + effectsHandler.effectTimestep
    }
  }

  effectsHandler.effects =
    effectsHandler.effects.map(
      (entry) => {
        if (entry.isActive) {
          return EffectEntry.create({
            ...entry,
            effect: iterateEffect(entry.effect)
          })
        }
      } 
    )

  // Events may have changed
  fire(effectsHandler, 'ActiveEffectsChanged', effectsHandler.active)
  return effectsHandler
}

const EffectEntry = {
  create: (o) => {
    return {
      effect: o.effect,
      isActive: o.isActive || false
    }
  }
}


import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'
const fakeData = () => {
  return [
    VisibleFileEffect.create({
      fromTime: 10240000,
      toTime: 10240300,
      projectName: "eyeson",
      vcsReference: "<hash>",
      filePath: "scratch-1/src/core.clj",
      viewportTopLine: 1,
      viewportBottomLine: 200
    }),
    CursorPositionEffect.create({
      fromTime: 10240230,
      toTime: 10240300,
      projectName: "eyeson",
      vcsReference: "<hash>",
      filePath: "scratch-1/src/core.clj",
      cursorLine: 2,
      cursorColumn: 20
    })
  ]
}