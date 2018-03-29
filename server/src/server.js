import { default as express } from 'express'
import { default as bodyParser } from 'body-parser'
import * as Store from './store' 
import * as Timeline from './timeline'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'

export const create = ({ logger = (...args) => {},
                         port }) => {
  const app = express()
  const store = Store.create()

  app.use(bodyParser.json())

  app.post('/effects', (req, res) => {
    try {
      const effects = JSON.parse(req.body)
      // ....
      res.status(200)
    } catch (e) {
      res.status(400).json({ err: e.message })
    }
  })

  app.get('/heatmaps', (req, res) => {
    logger(req)
    // TODO: async Store request
    // TODO: bin Timeline (it's just a set of effects bro)
    const timeline = Timeline.create(
      Store.query(store, {
        and: req.params
      })
    )
    logger(req, timeline)
    const heatmap = Timeline.heatmap(timeline)
    res.status(200).send(JSON.stringify(
      [heatmap],
      null,
      2
    ))
  })

  app.start = () => app.listen(port)

  return app
}

export const start = (server) => server.start()

export const stop = (server) => { /* wtf express? */}