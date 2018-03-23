import { List } from 'immutable'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { Effect } from '../vendor/eyeson-common/lib/effects'

export const heatmap = (timeline) => Heatmap.create(
  timeline.map(Effect.heatmap)
          .reduce(Heatmap.add)
)