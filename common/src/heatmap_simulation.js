import * as Heatmap from './heatmap'
import { Effect } from './effects'
import { on, fire } from './event_listener'
import { Set } from 'immutable'
import { assert } from './utils'

export const create = (o = {}) => {
  const heatmapSimulation = {
    heatmap: o.heatmap || Heatmap.create(),
    activeEffects: Set(o.activeEffects || []),
    timestep: 1,
    iterateInterval: 1000,
    decay: 0.99,  // TODO: tweak model numbers (also effect hQ's)
    eventListeners: []
  }
  return heatmapSimulation
}

// TODO: more regimented typing and assertion across the codebase
export const is = (o) => {
  return (
    Heatmap.is(o.heatmap) &&
    Set.isSet(o.activeEffects)
  )
}

export const setActiveEffects = (heatmapSimulation, activeEffects) => {
  assert(is(heatmapSimulation), "Cannot setActiveEffects on non-HeatmapSimulation.")
  heatmapSimulation.activeEffects = Set(activeEffects)
}

export const startIterate = (heatmapSimulation) => {
  heatmapSimulation.iterateIntervalID =
    setInterval(() => iterate(heatmapSimulation), heatmapSimulation.iterateInterval)
}

export const stopIterate = (heatmapSimulation) => {
  clearInterval(heatmapSimulation.iterateIntervalID)
  heatmapSimulation.iterateIntervalID = null
}

export const iterateToTime = (heatmapSimulation, endTime) => {
  while (heatmapSimulation.heatmap.time < endTime) {
    iterate(heatmapSimulation)
  }
}

const iterate = (heatmapSimulation) => {
  const newHeatmap =
    Heatmap.add(
      // Decay latent heat
      Heatmap.map(
        heatmapSimulation.heatmap,
        ([ lineNumber, heatQuantity ]) =>
          [ lineNumber, heatQuantity * heatmapSimulation.decay ]
      ),
      // Add active heat sources (effects)
      heatmapSimulation.activeEffects
        .map(Effect.heatmap)
        .reduce(Heatmap.add, Heatmap.create())
      // TODO: heat capacity of a line
    )
  // Advance time
  newHeatmap.time = heatmapSimulation.heatmap.time + heatmapSimulation.timestep
  heatmapSimulation.heatmap = newHeatmap
  fire(heatmapSimulation, 'HeatmapSimulationIterated', heatmapSimulation)
}