export const log = console.log
export const warn = console.warn

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
