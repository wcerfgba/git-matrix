import { default as express } from 'express'
import { default as bodyParser } from 'body-parser'
import { Store } from './store' 
//import { Effect } from '../vendor/eyeson-common/lib/effects'
import { Timeline as QWEqwe } from '../vendor/eyeson-common/lib/timeline'
import { Timeline } from './timeline'
import { log } from './utils'

export const Server = {
  new: (options) => {
    const app = express()
    const store = Store.new()

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

    app.get('/heatmap', (req, res) => {
      // TODO: lele how do i async
      const timeline = QWEqwe.new(
        Store.query(store, {
          and: req.params
        })
      )
      res.status(200).send(JSON.stringify(
        Timeline.heatmap(timeline)
      ))
    })

    app.start = () => app.listen(options.port)

    return app
  },
  start: (server) => server.start(),
  stop: (server) => { /* wtf express? */}
}