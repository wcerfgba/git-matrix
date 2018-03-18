import * as qwe from 'eyeson-common'
console.log(qwe)


import { HeatmapT, Heatmap, keys } from 'eyeson-common/heatmap'
import { FileLine } from 'eyeson-common/file_line' 
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