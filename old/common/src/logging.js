import * as util from 'util'

const logState = new class {
  stack = []
  filter = (logLine) => false   // No logging by default
}

export const log = (...args) => {
  let logLine = args
  if (!logState.filter([...logState.stack, ...logLine])) { return }
  logLine = logLine.map((obj) => {
    return util.inspect(obj, {
      depth: 1
    })
  })
  const indent = ' '.repeat(logState.stack.length * 2)
  const logEntry = indent + logLine.join('\n' + indent) + '\n'
  console.log(logEntry)
}

export const logMethod = (name) => {
  log(name)
  logState.stack.push(name)
}

export const logReturn = (value = '') => {
  log(value)
  logState.stack.pop()
}

export const filterLogs = (filter) => {
  logState.filter = filter
}