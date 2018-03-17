import { Heatmap } from './heatmap'
import { FileLine } from './file_line'
import { assertKeys } from './utils'

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
    assertKeys(VisibleFileEffect.keys, o)
    Object.assign(this, o)
  }

  heatmap() {
    return new Heatmap([
      [ new FileLine({
          projectName: 'string',
          vcsReference: 'string',
          filePath: 'string',
          lineNumber: 123 }),
        123.3 ]
    ])
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
    assertKeys(CursorPositionEffect.keys, o)
    Object.assign(this, o)
  }

  heatmap() {
    return new Heatmap([
      [ new FileLine({
          projectName: 'string',
          vcsReference: 'string',
          filePath: 'string',
          lineNumber: 123 }),
        123.3 ]
    ])
  }
}
