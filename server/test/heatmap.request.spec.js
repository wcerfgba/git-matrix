import * as Server from '../src/server'

describe('getHeatmaps', () => {
  let server = Server.create({
    port: 3000
  })

  test('200 OK', () => {
    const req = {}
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    }

    Server.getHeatmaps(server)(req, res)

    expect(res.status.mock.calls[0][0]).toEqual(200)
    expect(JSON.parse(res.send.mock.calls[0][0])).toEqual({
      entries: {
        2: 500,
      },
      filePath: "/home/jpreston/Sync/notes/movies.jf",
      time: 123123123,
    })
  })
})