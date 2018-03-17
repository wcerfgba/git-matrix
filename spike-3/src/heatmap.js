import { Map, Set } from 'immutable'

// A Heatmap is a map from FileLines to Numbers, representing how 'hot' a line 
// is.
export class Heatmap {
  constructor(entries) {
    this.heatmap = Map(entries)
  }

  add(other) {
    return Set(this.keySeq().concat(other.keySeq()))
      .reduce(
        (sum, key) => sum.set(
          key,
          (sum.get(key) || 0.0) +
          (this.get(key) || 0.0) +
          (other.get(key) || 0.0)
        ),
        new Heatmap()
      )
  }

  toImmutableMap() { return this.heatmap }
  get(key) { return this.heatmap.get(key) }
  set(key, value) { return this.heatmap.set(key, value) }
  keys() { return this.heatmap.keys() }
  keySeq() { return this.heatmap.keySeq() }
  toArray() { return this.heatmap.toArray() }
  toJSON() { return JSON.stringify(this.toArray()) }
  [Symbol.iterator]() { return this.heatmap[Symbol.iterator]() }
}

export const heatmap = (o) => o.heatmap()