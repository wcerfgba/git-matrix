import { Map } from 'immutable'
import { FileLine } from './file_line'

export type HeatmapT = Map<FileLine, number>

export type HeatmapEntryT = [FileLine, number]

export const Heatmap =
  (entries : Array<HeatmapEntryT> = []) => Map<FileLine, number>(entries)

export const keys = (heatmap : HeatmapT) => <FileLine[]>heatmap.keySeq().toArray()
export const entries = (heatmap : HeatmapT) => <HeatmapEntryT[]>heatmap.entrySeq().toArray()