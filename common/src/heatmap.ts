import { Map } from 'immutable'
import { FileLine } from './file_line'

export type HeatmapT = Map<FileLine, number>

export type HeatmapEntryT = [FileLine, number]

export const Heatmap =
  (entries : Array<HeatmapEntryT> = []) => Map<FileLine, number>(entries)

export const keys = (heatmap : HeatmapT) => heatmap.keySeq().toArray()