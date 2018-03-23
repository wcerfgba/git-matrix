import { on, fire } from '../vendor/eyeson-common/lib/event_listener'

export const create = () => {
  const effectsHandler = {
    history: fakeData(), // [],
    active: [],
    iterateInterval: 1000,
    iterateIntervalID: null,
    eventListeners: []
  }
  // TODO: separate  startIterate function
  effectsHandler.iterateIntervalID =
    setInterval(() => iterate(effectsHandler), effectsHandler.iterateInterval)
  return effectsHandler
}

export const iterate = (effectsHandler) => {
  const iterateEffect = (effect) => Effect.create({
                                      ...effect,
                                      toTime: effect.toTime + 1
                                    })
  // Iterate active effects
  // TODO: use sets and pointers, not arrays and copies :P
  effectsHandler.history = 
    effectsHandler.history.map((effect) => {
                                  if (effectsHandler.active.includes(effect)) {
                                    return iterateEffect(effect)
                                  }
                                  return effect
                                })
  effectsHandler.active = effectsHandler.active.map(iterateEffect)
  // Events may have changed
  fire(effectsHandler, 'ActiveEffectsChanged', effectsHandler.active)
  return effectsHandler
}

// TODO: way to disable effects (remove them from 'active' set)


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