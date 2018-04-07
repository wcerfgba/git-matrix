import { default as express } from 'express'
import { default as bodyParser } from 'body-parser'
import * as Store from './store' 
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'

export const create = (o) => {
  const server = {
    app: express(),
    heatmapStore: Store.create(),
    port: o.port || 3000
  }

  server.app.use(bodyParser.json())

  server.app.post('/effects', postEffects(server))
  server.app.get('/heatmaps', getHeatmaps(server))

  return server
}

export const start = (server) => server.start(server.port)

export const stop = (server) => { /* wtf express? */}

export const postEffects = (server) => (req, res) => {
  try {
    const effects = JSON.parse(req.body)
    // ....
    res.status(200)
  } catch (e) {
    res.status(400).json({ err: e.message })
  }
}

export const getHeatmaps = (server) => (req, res) => {
  // TODO: async Store request
  const heatmaps = Store.query(server.heatmapStore, {
    and: req.params
  })
  // TODO: ungarbage this module, use new logging
  res.status(200).send(JSON.stringify(
    heatmaps,
    null,
    2
  ))
}