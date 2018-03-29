export const log = console.log
export const warn = console.warn

export const assert = (p, m) => {
  if (p) { return p }
  throw new Error(m)
}

export const logThrows = (f) => (...args) => {
  try {
    return f(...args)
  } catch (e) {
    console.log(e)
  }
}

export const range = (from, to, incr = 1, incrFun = x => x + incr) => {
  const range = []
  for (let next = from; next < to; next = incrFun(next)) {
    range.push(next)
  }
  return range
}

// From https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
export const hashCode = (fileLine) => {
  const s = JSON.stringify(fileLine)
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
}

export const isFalsey = (x) => (x || false) == false
export const isTruthy = (x) => !isFalsey(x)