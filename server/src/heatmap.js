import { Heatmap as _Heatmap } from '../vendor/eyeson-common/lib/heatmap'
import { Set } from 'immutable'

export const Heatmap = {
  add: (a, b) =>
    Set([...a.keys(), ...b.keys()])
      .reduce(
        (sum, key) => sum.set(
          key,
          (sum.get(key) || 0.0) +
          (a.get(key) || 0.0) +
          (b.get(key) || 0.0)
        ),
        _Heatmap.new()
      )
}