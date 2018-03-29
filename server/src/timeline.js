import { List } from 'immutable'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as HeatmapSimulation from '../vendor/eyeson-common/lib/heatmap_simulation'
import { Effect } from '../vendor/eyeson-common/lib/effects'

export const create = (entries) => entries
export const is = (o) => (
  Array.isArray(o) &&
  o.map(Effect.is).reduce((a, b) => a && b)
)

export const heatmap = (timeline) => {
  const time = 10240000
  const simulation = HeatmapSimulation.create({
    heatmap: Heatmap.create({
      projectName: '',
      vcsReference: '',
      filePath: '/home/jpreston/Sync/notes/movies.jf',
      time
    }),
    activeEffects: timeline
  })
  // TODO: pure methods lel
  HeatmapSimulation.iterateToTime(simulation, time + 5000)
  return simulation.heatmap
}