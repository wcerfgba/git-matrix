import * as Heatmap from './heatmap'
import { Effect } from './effects'
import { on, fire } from './event_listener'
import { Set } from 'immutable'
import { assert } from './utils'
import { log, logMethod, logReturn } from './logging'

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

export const toJSON = (heatmapSimulation) => {
  const json = {
    ...heatmapSimulation,
    activeEffects: heatmapSimulation.activeEffects.entrySeq().toArray()
  }
  delete json.toJSON
  return json
}

// TODO: more regimented typing and assertion across the codebase
export const is = (o) => {
  return (
   // Heatmap.is(o.heatmap) &&
    Set.isSet(o.activeEffects)
  )
}

export const setActiveEffects = (heatmapSimulation, activeEffects) => {
  // TODO: why is Heatmap.is lying to me??!?!
  assert(is(heatmapSimulation), "Cannot setActiveEffects on non-HeatmapSimulation.")
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

export const iterate = (heatmapSimulation) => {
  logMethod('HeatmapSimulation.iterate')
  log('heatmapSimulation', heatmapSimulation)
  const latent = 
    Heatmap.map(
      heatmapSimulation.heatmap,
      ([ lineNumber, heatQuantity ]) =>
        [ lineNumber, heatQuantity * heatmapSimulation.decay ]
    )
  log('latent', latent)
  
  const active = 
    heatmapSimulation.activeEffects
      .map(Effect.heatmap)
      .reduce(Heatmap.add, Heatmap.create())
  log('active', active)
  
  const newHeatmap = Heatmap.add(latent, active)
  log('newHeatmap', newHeatmap)

  newHeatmap.time = heatmapSimulation.heatmap.time + heatmapSimulation.timestep
  log('time', newHeatmap.time)

  heatmapSimulation.heatmap = newHeatmap
  //fire(heatmapSimulation, 'HeatmapSimulationIterated', heatmapSimulation)

  logReturn()
}