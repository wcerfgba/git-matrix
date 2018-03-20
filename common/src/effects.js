export const Effect = {
  is: (o) => (
    typeof o.effectType === 'string' &&
    typeof o.fromTime === 'number' &&
    typeof o.toTime === 'number' &&
    typeof o.projectName === 'string' &&
    typeof o.vcsReference === 'string' &&
    // Enforce strict subtyping
    (o.effectType === 'VisibleFileEffect' ||
     o.effectType === 'CursorPositionEffect')
  ),
  new: (o) => ({
    effectType: o.effectType,
    fromTime: o.fromTime,
    toTime: o.toTime,
    projectName: o.projectName,
    vcsReference: o.vcsReference
  })
}

export const VisibleFileEffect = {
  is: (o) => (
    Effect.is(o) &&
    o.effectType === 'VisibleFileEffect' &&
    typeof o.filePath === 'string' &&
    typeof o.viewportTopLine === 'number' &&
    typeof o.viewportBottomLine === 'number'
  ),
  new: (o) => ({
    ...Effect.new(o),
    effectType: 'VisibleFileEffect',
    filePath: o.filePath,
    viewportTopLine: o.viewportTopLine,
    viewportBottomLine: o.viewportBottomLine
  })
}

export const CursorPositionEffect = {
  is: (o) => (
    Effect.is(o) &&
    o.effectType === 'CursorPositionEffect' &&
    typeof o.filePath === 'string' &&
    typeof o.cursorLine === 'number' &&
    typeof o.cursorColumn === 'number'
  ),
  new: (o) => ({
    ...Effect.new(o),
    effectType: 'CursorPositionEffect',
    filePath: o.filePath,
    cursorLine: o.cursorLine,
    cursorColumn: o.cursorColumn
  })
}
