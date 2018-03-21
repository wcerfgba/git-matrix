// A FileLine provides all the information necessary to target a particular 
// line of a file. 
export const create = (o) => new class {
  // Arbitrary reference at each end (repo name)
  projectName = o.projectName

  // Something usable by the project's configured VCS to determine a set of 
  // files. We may want to look at the diff with the next revision after 
  // this one when determining which lines have received effects.
  vcsReference = o.vcsReference
  
  // Relative to project root.
  filePath = o.filePath
  
  lineNumber = o.lineNumber

  equals(other) { return equals(this, other) }
  hashCode() { return hashCode(this) }
}

export const is = (o) => (
  typeof o.projectName === 'string' &&
  typeof o.vcsReference === 'string' &&
  typeof o.filePath === 'string' &&
  typeof o.lineNumber === 'number'
)

export const equals = (a, b) => (
  a.projectName === b.projectName &&
  a.vcsReference === b.vcsReference &&
  a.filePath === b.filePath &&
  a.lineNumber === b.lineNumber
)

// From https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
export const hashCode = (fileLine) => {
  const s = JSON.stringify(fileLine)
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
}