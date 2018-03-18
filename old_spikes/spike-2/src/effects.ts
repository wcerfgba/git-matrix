import { Effect } from './effect';
import { newHeatmap,
         HeatmapProvider } from './heatmap';

export class VisibleFileEffect implements Effect,
                                          HeatmapProvider {
  readonly fromTime: number;
  readonly toTime: number;
  readonly projectName: string;
  readonly vcsReference: string;
  readonly filePath: string;
  readonly viewportTopLine: number;
  readonly viewportBottomLine: number;

  constructor({
    fromTime,
    toTime,
    projectName,
    vcsReference,
    filePath,
    viewportTopLine,
    viewportBottomLine,
  }) {
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.projectName = projectName;
    this.vcsReference = vcsReference;
    this.filePath = filePath;
    this.viewportTopLine = viewportTopLine;
    this.viewportBottomLine = viewportBottomLine;
  }

  heatmap() {
    return newHeatmap({ heatmap: new Map([
      [ { projectName: 'string',
          vcsReference: 'string',
          filePath: 'string',
          lineNumber: 123 },
        123.3 ]
    ]) });
  }
}
export const newVisibleFileEffect = (o) => new VisibleFileEffect(o);

export class CursorPositionEffect implements Effect,
                                             HeatmapProvider {
  readonly fromTime: number;
  readonly toTime: number;
  readonly projectName: string;
  readonly vcsReference: string;
  readonly filePath: string;
  readonly cursorLine: number;
  readonly cursorColumn: number;

  constructor({
    fromTime,
    toTime,
    projectName,
    vcsReference,
    filePath,
    cursorLine,
    cursorColumn
  }) {
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.projectName = projectName;
    this.vcsReference = vcsReference;
    this.filePath = filePath;
    this.cursorLine = cursorLine;
    this.cursorColumn = cursorColumn;
  }

  heatmap() {
    return newHeatmap({ heatmap: new Map([
      [ { projectName: 'string',
          vcsReference: 'string',
          filePath: 'string',
          lineNumber: 123 },
        123.3 ]
    ]) });
  }
}
export const newCursorPositionEffect = (o) => new CursorPositionEffect(o);