import { Server } from '../src/server'
import { default as fetch } from 'isomorphic-fetch'

describe('GET /heatmap', () => {
  let server = Server.create({
    port: 3000
  })

  beforeAll(() => {
    server = Server.start(server)
  })

  afterAll(() => {
    server = Server.stop(server)
  })

  test('200 OK', done => {
    fetch('http://localhost:3000/heatmap')
      .then((res) => {
        res
          .text()
          .then((body) => {
            console.log(body)
            expect(res.status).toEqual(200)
            done()
          })
      })
  })
})