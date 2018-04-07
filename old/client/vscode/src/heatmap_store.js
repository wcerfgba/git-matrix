import * as Store from './store'
import * as NetworkHandler from './network_handler'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { logThrows } from '../vendor/eyeson-common/lib/utils'
import { fire } from '../vendor/eyeson-common/lib/event_listener'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'

export const create = (o = {}) => {
  const heatmapStore = {
    store: Store.create({
      name: 'heatmaps'
    }),
    networkHandler: NetworkHandler.create({
      server: 'http://localhost:3000', // TODO: env/config
      endpoint: 'heatmaps',
      inflate: (heatmaps => heatmaps.map(Heatmap.create))
    }),
    eventListeners: []
  }
  return heatmapStore
}

export const getLatest = (heatmapStore, query) => {
  logMethod('HeatmapStore.getLatest')
  log('query', query)
  const heatmaps = Store.find(heatmapStore.store, query)
  log('heatmaps', heatmaps)
  heatmaps.sort((a, b) => a.time - b.time)
  let heatmap = heatmaps.pop()
  log('heatmap', heatmap)
  if (heatmap === undefined) {
    logReturn(null)
    return null
  }
  heatmap = Heatmap.create(heatmap)
  logReturn(heatmap)
  return heatmap
}

export const sync = async (heatmapStore) => {
  logMethod('HeatmapStore.sync')
  const heatmaps = await NetworkHandler.get(heatmapStore.networkHandler)
  log('heatmaps', heatmaps)
  Store.insertMany(heatmapStore.store, heatmaps)
  fire(heatmapStore, 'DocumentsChanged')
  logReturn()
}