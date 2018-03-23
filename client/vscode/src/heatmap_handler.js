import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { Effect } from '../vendor/eyeson-common/lib/effects'
import * as EffectsHandler from './effects_handler'
import { on, fire } from '../vendor/eyeson-common/lib/event_listener'

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
        ([fileLine, heatQuantity]) => [fileLine, heatQuantity * heatmapHander.decay],
        heatmapHandler.heatmap
      ),
      // Add active heat sources (effects)
      heatmapHandler.activeEffects.map(Effect.heatmap).reduce(Heatmap.add)
      // TODO: heat capacity of a line
    )
  fire(heatmapHandler, 'HeatmapIterated', heatmapHandler.heatmap)
}