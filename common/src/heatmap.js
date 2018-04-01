import { Map, Set } from 'immutable'
import * as FileLine from './file_line'

export const create = (o = {}) => {
  const heatmap = {
    // Map from line number to heat quantity
    entries: cleanEntries(o.entries),

    time: o.time || Date.now(),
    
    // Arbitrary reference at each end (repo name)
    projectName: o.projectName,

    // Something usable by the project's configured VCS to determine a set of 
    // files. We may want to look at the diff with the next revision after 
    // this one when determining which lines have received effects.
    vcsReference: o.vcsReference,
    
    // Relative to project root.
    filePath: o.filePath
  }
  return heatmap
}

const cleanEntries = (entries) => {
  entries = entries || []
  entries = Map(entries)
  entries = entries.entrySeq().toArray()
  entries = entries.map(
    ([lineNumber, heatQuantity]) => [Number(lineNumber), Number(heatQuantity)]
  )
  entries = Map(entries)
  return entries
}

export const is = (o) => (
  Map.isMap(o.entries) &&
  entries(o).map(([lineNumber, heatQuantity]) => (
    typeof lineNumber === 'number' &&
    typeof heatQuantity === 'number'
  )).reduce((a, b) => a && b) &&
  typeof o.time === 'number' &&
  // typeof o.projectName === 'string' &&
  // typeof o.vcsReference === 'string' &&
  typeof o.filePath === 'string'
)

export const lineNumbers = (heatmap) => heatmap.entries.keySeq().toArray()
export const entries = (heatmap) => heatmap.entries.entrySeq().toArray()

export const get = (heatmap, lineNumber) => {
  return heatmap.entries.get(lineNumber) || 0.0
}

export const set = (heatmap, lineNumber, heatQuantity) => {
  heatmap.entries = heatmap.entries.set(lineNumber, heatQuantity)
  return heatmap
}

export const add = (a, b) => {
  return Set([
    ...lineNumbers(a),
    ...lineNumbers(b)
  ]).reduce(
    (sum, lineNumber) => {
      return set(sum, lineNumber, (
        get(sum, lineNumber) +
        get(a, lineNumber) +
        get(b, lineNumber)
      ))
    },
    // Inherit attributes from first argument, but start with an empty entry-set
    create({ ...a, entries: [] })
  )
}

export const map = (heatmap, f) => {
  return create({
    ...heatmap,
    entries: cleanEntries(entries(heatmap).map(f)),
  })
}