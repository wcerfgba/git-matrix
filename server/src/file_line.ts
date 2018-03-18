import { FileLine as FileLineT } from '../../common/src/file_line' 
import { Map, is } from 'immutable'

export class FileLine implements FileLineT {
  readonly projectName
  readonly vcsReference
  readonly filePath
  readonly lineNumber

  constructor(o) { Object.assign(this, o) }

  toObject() : FileLineT { return this }
  toImmutableMap() { return Map(this.toObject()) }
  equals(other) { return is(this.toImmutableMap(), other.toImmutableMap()) }
  hashCode() { return this.toImmutableMap().hashCode() }
}