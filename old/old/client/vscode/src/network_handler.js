import 'isomorphic-fetch'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'

export const create = (o = {}) => {
  const networkHandler = {
    server: o.server,
    endpoint: o.endpoint,
    inflate: o.inflate || (x => x),
    deflate: o.deflate || JSON.stringify
  }
  return networkHandler
}

export const get = async (networkHandler) => {
  logMethod('NetworkHandler.get')
  const res = await fetch(`${networkHandler.server}/${networkHandler.endpoint}`)
  log('res', res)
  const json = await res.json()
  log('json', json)
  const inflated = await networkHandler.inflate(json)
  logReturn(inflated)
  return inflated
}