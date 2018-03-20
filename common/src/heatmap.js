import { Map } from 'immutable'
import { FileLine } from './file_line'

export const Heatmap = {
  is: (o) => (
    Map.isMap(o) &&
    o.entries().map(([k, v]) => (
      FileLine.is(k) &&
      typeof v === 'number'
    )).reduce((a, b) => a && b)
  ),
  new: (entries = []) => Map(entries)
}
