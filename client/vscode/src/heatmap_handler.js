import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { Effect } from '../vendor/eyeson-common/lib/effects'
import * as EffectsHandler from './effects_handler'
import { on, fire } from '../vendor/eyeson-common/lib/event_listener'
import { Set } from 'immutable'

export const create = (o) => {
  const heatmapHandler = {
    heatmap: Heatmap.create(),
    activeEffects: Set(),
    iterateInterval: 1000,
    decay: 0.999,
    effectsHandler: o.effectsHandler,
    eventListeners: []
  }   
  on(heatmapHandler.effectsHandler, 'ActiveEffectsChanged',
		(activeEffects) => heatmapHandler.activeEffects = activeEffects)
	// NetworkHandler.on('ReceivedExistingHeatmaps')
  return heatmapHandler
}

export const startIterate = (heatmapHandler) => {
  heatmapHandler.iterateIntervalID =
    setInterval(() => iterate(heatmapHandler), heatmapHandler.iterateInterval)
}

export const stopIterate = (heatmapHandler) => {
  clearInterval(heatmapHandler.iterateIntervalID)
  heatmapHandler.iterateIntervalID = null
}

const iterate = (heatmapHandler) => {
  heatmapHandler.heatmap =
    Heatmap.add(
      // Decay latent heat
      Heatmap.map(
        // TODO: need to sort out time-effect relationship: this is now in realtime, whereas current implementation integrates over time on Effect.heatmap() !!!!!
        heatmapHandler.heatmap,
        ([fileLine, heatQuantity]) => [fileLine, heatQuantity * heatmapHandler.decay]
      ),
      // Add active heat sources (effects)
      heatmapHandler.activeEffects
        .map(Effect.heatmap)
        .reduce(Heatmap.add, Heatmap.create())
      // TODO: heat capacity of a line
    )
  fire(heatmapHandler, 'HeatmapIterated', heatmapHandler.heatmap)
}