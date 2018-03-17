import { List, Map } from 'immutable'
import { toJSON } from './to_json'

export const log = (...args) => {
  args.map((a) => console.log(a.toJSON()))
  return args
}

export const assertKeys = (ks, o) => {
  ks = List(ks)
  o = Map(o)
  assert(
    o.keySeq().isSubset(ks) && ks.isSubset(o.keySeq())
  )
}

export const assert = (p, m) => {
  if (p) { return p }
  throw new Error(m)
}
