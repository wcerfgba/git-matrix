import * as HeatmapSimulation from '../src/heatmap_simulation'
import * as Heatmap from '../src/heatmap'
import { CursorPositionEffect, VisibleFileEffect } from '../src/effects'

import * as logging from '../src/logging'

// logging.filterLogs((logLine) => {
//   return (
//     logLine[0] === 'HeatmapSimulation.iterate'
//   )
// })

describe('HeatmapSimulation', () => {
  describe('iterate', () => {
    test('fixture #1', () => {
      let subject = HeatmapSimulation.create({
        heatmap: Heatmap.create({
          filePath: 'wekfpwej;',
          time: 1020200,
          entries: [
            [289374, 235],
            [1, 0.25]
          ]
        }),
        activeEffects: [
          VisibleFileEffect.create({
            fromTime: 1020300,
            toTime: 1020301,
            viewportTopLine: 1,
            viewportBottomLine: 3
          }),
          CursorPositionEffect.create({
            fromTime: 1020400,
            toTime: 1020401,
            cursorLine: 2
          })
        ]
      })
      let expectation = HeatmapSimulation.create({
        heatmap: Heatmap.create({
          filePath: 'wekfpwej;',
          time: 1020201,
          entries: [
            [289374, 211.5],
            [1, 5.225],
            [2, 55],
            [3, 5]
          ]
        }),
        activeEffects: [
          VisibleFileEffect.create({
            fromTime: 1020300,
            toTime: 1020301,
            viewportTopLine: 1,
            viewportBottomLine: 3
          }),
          CursorPositionEffect.create({
            fromTime: 1020400,
            toTime: 1020401,
            cursorLine: 2
          })
        ]
      })
      HeatmapSimulation.iterate(subject)
      expect(subject).toEqual(expectation)
    })
  })
})