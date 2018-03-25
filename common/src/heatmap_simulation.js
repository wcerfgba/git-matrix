import * as Heatmap from './heatmap'
import { Effect } from './effects'
import { on, fire } from './event_listener'
import { Set } from 'immutable'

export const create = (o) => {
  const heatmapSimulation = {
    heatmap: o.heatmap || Heatmap.create(),
    activeEffects: Set(o.activeEffects || []),
    timestep: 1,
    iterateInterval: 1000,
    decay: 0.999,
    eventListeners: []
  }
  return heatmapSimulation
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