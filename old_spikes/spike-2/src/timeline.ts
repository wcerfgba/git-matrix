import { Effect } from './effect';
import { newHeatmap,
         HeatmapProvider } from './heatmap';

type TimelineAttrs = { readonly effects?: Array<Effect & HeatmapProvider> };

export class Timeline implements HeatmapProvider {
  readonly effects;
  // TODO: write a sweet.js macro to dump TimelineAttrs in here

  constructor(o : TimelineAttrs) { Object.assign(this, o); }

  heatmap() {
    return newHeatmap({ heatmap:
      this.effects.map(effect => effect.heatmap())
                  .reduce((sum, next) => sum.add(next))
    });
  }
}

export const newTimeline = (o: TimelineAttrs) => new Timeline(o);