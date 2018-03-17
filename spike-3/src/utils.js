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
    ks.isSubset(o.keySeq()),
    "Object "
  )
}

export const getMany = (ks, o) => Map(ks.map(k => [k, o[k]])).toObject()

export const assignKeys = (ks, o, target) => {
  assertKeys(ks, o)
  Object.assign(target, getMany(ks, o))
}

export const assert = (p, m) => {
  if (p) { return p }
  throw new Error(m)
}

export const range = (from, to, incr = 1, incrFun = x => x + incr) => {
  const range = []
  for (let next = from; next < to; next = incrFun(next)) {
    range.push(next)
  }
  return range
}

export const integrate = (f, tStart, tEnd, { decay = 1.0, timestep = 0.001 }) =>
  range(tStart, tEnd, timestep)
    .reduce(
      (sum, tNext) => (decay * sum) + (timestep * f(tNext)),
      0.0
    )