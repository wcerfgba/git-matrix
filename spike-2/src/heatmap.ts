import { Map } from 'immutable';
import { FileLine } from './file_line';
import { reduce } from './utils';

export type HeatmapAttrs = {
  readonly heatmap: Map<FileLine, number>
};

export class Heatmap {
  heatmap;

  constructor(o : HeatmapAttrs = {
    heatmap: Map()
  }) { Object.assign(this, o); }

  add(other : Heatmap) {
    return reduce(
      (sum, key) => sum.set(
        key,
        (sum.get(key) || 0.0) +
        (this.get(key) || 0.0) +
        (other.get(key) || 0.0)
      ),
      new Set([...this.keys(), ...other.keys()]),
      new Heatmap()
    );
  }

  get(key) { return this.heatmap.get(key); }
  set(key) { return this.heatmap.set(key); }
  keys() { return this.heatmap.keys(); }
  [Symbol.iterator]() { return this.heatmap[Symbol.iterator]; }
  // TODO: need to overload equality on FileLines inside Map to get this shit
  // to work: need value equality for map keys. fuuuuck es6
}

export const newHeatmap : (o : HeatmapAttrs) => Heatmap =
  (o) => new Heatmap(o);

export interface HeatmapProvider {
  heatmap() : Heatmap;
}
