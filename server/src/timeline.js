import { List } from 'immutable'
import * as _Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as Heatmap from './heatmap'
import { Effect } from './effects'

export const heatmap = (timeline) => _Heatmap.create(
  timeline.map(Effect.heatmap)
          .reduce(Heatmap.add)
)