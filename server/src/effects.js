import { Heatmap } from './heatmap'
import { FileLine } from './file_line'
import { assignKeys, range } from './utils'

export class VisibleFileEffect {
  static keys = [
    'fromTime',
    'toTime',
    'projectName',
    'vcsReference',
    'filePath',
    'viewportTopLine',
    'viewportBottomLine'
  ]

  constructor(o) {
    assignKeys(VisibleFileEffect.keys, o, this)
  }

  heatmap() {
    return new Heatmap(
      range(this.viewportTopLine, this.viewportBottomLine)
        .map(lineNumber => [
          new FileLine({ ...this, lineNumber }),
          0.1 * (this.toTime - this.fromTime)
        ])
    )
  }
}

export class CursorPositionEffect {
  static keys = [
    'fromTime',
    'toTime',
    'projectName',
    'vcsReference',
    'filePath',
    'cursorLine',
    'cursorColumn'
  ]

  constructor(o) {
    assignKeys(CursorPositionEffect.keys, o, this)
  }

  heatmap() {
    return new Heatmap([
      [ new FileLine({ ...this, lineNumber: this.cursorLine }),
        1.0 * (this.toTime - this.fromTime) ]
    ])
  }
}
