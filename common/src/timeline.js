import { Effect } from './effects'

export const create = (entries) => entries
export const is = (o) => (
  Array.isArray(o) &&
  o.map(Effect.is).reduce((a, b) => a && b)
)