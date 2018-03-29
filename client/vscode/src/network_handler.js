import 'isomorphic-fetch'

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
  const res = await fetch(`${networkHandler.server}/${networkHandler.endpoint}`)
  const json = await res.json()
  console.log(json)
  const inflated = await networkHandler.inflate(json)
  return inflated
}