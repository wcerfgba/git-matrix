import { Effect } from './effects'

export const Timeline = {
  is: (o) => (
    Array.isArray(o) &&
    o.map(Effect.is).reduce((a, b) => a && b)
  ),
  new: (entries) => entries
}