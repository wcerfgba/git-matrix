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
    decay: 0.9,  // TODO: tweak model numbers (also effect hQ's)
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
  // TODO: why is Heatmap.is lying to me??!?!
  //assert(is(heatmapSimulation), "Cannot setActiveEffects on non-HeatmapSimulation.")
  heatmapSimulation.activeEffects = Set(activeEffects)
}

export const activate = (heatmapSimulation) => {
  heatmapSimulation.iterateIntervalID =
    setInterval(() => iterate(heatmapSimulation), heatmapSimulation.iterateInterval)
}

export const deactivate = (heatmapSimulation) => {
  clearInterval(heatmapSimulation.iterateIntervalID)
  heatmapSimulation.iterateIntervalID = null
}

export const iterateToTime = (heatmapSimulation, endTime) => {
  while (heatmapSimulation.heatmap.time < endTime) {
    iterate(heatmapSimulation)
  }
}

const iterate = (heatmapSimulation) => {
  console.log('HeatmapSimulation.iterate')
  console.log(heatmapSimulation)
  const latent = 
    Heatmap.map(
      heatmapSimulation.heatmap,
      ([ lineNumber, heatQuantity ]) =>
        [ lineNumber, heatQuantity * heatmapSimulation.decay ]
    )
  console.log('latent = ', latent)
  
  const active = 
    heatmapSimulation.activeEffects
      .map(Effect.heatmap)
      .reduce(Heatmap.add, Heatmap.create())
  console.log('active = ', active)
  
  const newHeatmap = Heatmap.add(latent, active)
  newHeatmap.time = heatmapSimulation.heatmap.time + heatmapSimulation.timestep

  heatmapSimulation.heatmap = newHeatmap
  fire(heatmapSimulation, 'HeatmapSimulationIterated', heatmapSimulation)
}