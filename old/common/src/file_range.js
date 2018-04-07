import * as File from './file'

export const create = (o = {}) => {
  return {
    ...File.create(o),
    fromLineNumber: o.fromLineNumber,
    toLineNumber: o.toLineNumber
  }
}