import { List } from 'immutable'
import { Heatmap as _Heatmap } from '../vendor/eyeson-common/lib/heatmap'
import { Heatmap } from './heatmap'
import { Effect } from './effects'

export const Timeline = {
  heatmap: (timeline) => _Heatmap.new(
    timeline.map(Effect.heatmap)
            .reduce(Heatmap.add)
  )
}
