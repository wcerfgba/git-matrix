import { default as express } from 'express'
import { default as bodyParser } from 'body-parser'
import { Store } from './store' 
import { Effect } from './effect'
import { Timeline } from './timeline'
import { log } from './utils'

const store = Store.getInstance()

const app = express()

app.use(bodyParser.json())

app.post('/effects', (req, res) => {
  try {
    const effects = JSON.parse(req.body)
    assert(typeof effects === 'array', "Expected array of effect objects")
    effects.map(Effect.new).forEach(effect => store.put(effect))
    res.status(200)
  } catch (e) {
    res.status(400).json({ err: e.message })
  }
})

app.get('/heatmap', (req, res) => {
  const timeline = new Timeline(
    store.query({
      and: req.params
    })
  )
  res.status(200).send(
    timeline.heatmap().toJSON()
  )
})

app.listen(3000)