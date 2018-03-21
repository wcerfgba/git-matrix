import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { Set } from 'immutable'

export const add = (a, b) => {
  return Set([
    ...Heatmap.fileLines(a),
    ...Heatmap.fileLines(b)
  ]).reduce(
    (sum, fileLine) => Heatmap.set(sum, fileLine, (
      Heatmap.get(sum, fileLine) +
      Heatmap.get(a, fileLine) +
      Heatmap.get(b, fileLine)
    )),
    Heatmap.create()
  )
}