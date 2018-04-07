export const Event = {
 create: (o) => ({
   time: o.time,
   eventType: o.eventType
 }),
 is: (o) => (
   typeof o.time === 'number' &&
   typeof o.eventType === 'string' &&
   // Document contents changed somehow
   (o.eventType === 'FileChanged' ||
    o.eventType === 'ClosedFile' ||
    o.eventType === 'OpenedFile' ||
    o.eventType === 'SavedFile' ||
    o.eventType === 'FocusedFile' ||
    o.eventType === 'UnfocusedFile' ||
    o.eventType === 'FileBecameVisible' ||
    o.eventType === 'FileBecameNonvisible'
    // Need to hack in scroll / visible lines from vscode internals. :/
  )
 )
}