import { List } from 'immutable'
import { Heatmap, heatmap } from './heatmap'
import { add } from './add'

export class Timeline {
  constructor(entries) {
    this.effects = List(entries)
  }

  heatmap() {
    return new Heatmap(
      this.effects.map(heatmap)
                  .reduce(add)
    );
  }
}