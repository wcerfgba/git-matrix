import { Map } from 'immutable'
import * as FileLine from './file_line'

export const create = (entries = []) => Map(entries)

export const is = (o) => (
  Map.isMap(o) &&
  o.entries().map(([k, v]) => (
    FileLine.is(k) &&
    typeof v === 'number'
  )).reduce((a, b) => a && b)
)

export const fileLines = (heatmap) => heatmap.keySeq().toArray()
export const entries = (heatmap) => heatmap.entrySeq().toArray()

export const get = (heatmap, k) => {
  return heatmap.get(k) || 0.0
}

export const set = (heatmap, k, v) => {
  return heatmap.set(k, v)
}