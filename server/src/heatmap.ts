import { HeatmapT, Heatmap, keys } from '../../common/src/heatmap'
import { FileLine } from '../../common/src/file_line' 
import { Map, Set } from 'immutable'

export const add =
  (a : HeatmapT, b : HeatmapT) =>
    Set([...keys(a), ...keys(b)])
      .reduce(
        (sum, key) => sum.set(
          key,
          (sum.get(key) || 0.0) +
          (a.get(key) || 0.0) +
          (b.get(key) || 0.0)
        ),
        Heatmap()
      )