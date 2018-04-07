import * as File from './file'

export const create = (o = {}) => {
  return {
    ...File.create(o),
    lineNumber: o.lineNumber
  }
}