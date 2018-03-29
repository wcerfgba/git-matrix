import * as Store from './store'
import * as NetworkHandler from './network_handler'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { logThrows } from '../vendor/eyeson-common/lib/utils'
import { fire } from '../vendor/eyeson-common/lib/event_listener'

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
  console.log(heatmapStore)
  return heatmapStore
}

export const findLatest = (heatmapStore, query) => {
  const heatmaps = Store.find(heatmapStore.store, query)
  heatmaps.sort((a, b) => a.time - b.time)
  const heatmap = heatmaps.pop()
  return heatmap
}

export const sync = async (heatmapStore) => {
  console.log('off for heatmaps')
  const heatmaps = await NetworkHandler.get(heatmapStore.networkHandler)
  console.log('got heatmaps', heatmaps)
  Store.insertMany(heatmapStore.store, heatmaps)
  fire(heatmapStore, 'DocumentsChanged')
}