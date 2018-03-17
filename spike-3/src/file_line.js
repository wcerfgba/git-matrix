import { Map, is } from 'immutable'
import { assertKeys } from './utils'

// A FileLine provides all the information necessary to target a particular 
// line of a file. 
export class FileLine {
  static keys = [
    // Arbitrary reference at each end (repo name)
    'projectName',

    // Something usable by the project's configured VCS to determine a set of 
    // files. We may want to look at the diff with the next revision after 
    // this one when determining which lines have received effects.
    'vcsReference',
    
    // Relative to project root.
    'filePath',
    
    'lineNumber'
  ]

  constructor(o) {
    assertKeys(FileLine.keys, o)
    Object.assign(this, o)
  }

  toObject() { return this }
  toImmutableMap() { return Map(this.toObject()) }
  equals(other) { return is(this.toImmutableMap(), other.toImmutableMap()) }
  hashCode() { return this.toImmutableMap().hashCode() }
}