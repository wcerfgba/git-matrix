import * as HeatmapEditor from '../src/heatmap_editor'
import * as HeatmapStore from '../src/heatmap_store'
import * as Heatmap from '../vendor/eyeson-common/src/heatmap'
import * as HeatmapSimulation from '../vendor/eyeson-common/src/heatmap_simulation'
import { CursorPositionEffect } from '../vendor/eyeson-common/src/effects'

describe('HeatmapEditor', () => {
  describe('activate', () => {
    let subject

    beforeEach(() => {
      subject = HeatmapEditor.create({
        textEditor: {
          document: {
            fileName: 'qweqwiej'
          },
          _visibleRanges: [],
          selection: {
            active: {
              line: 0,
              character: 0
            }
          }
        }
      })
    })

    it('initializes the simulation with the latest heatmap for the file, the active effects, and the correct timestep', () => {
      HeatmapStore.getLatest = jest.fn((heatmapStore, query) => {
        return Heatmap.create({
          time: 123
        })
      })
      HeatmapEditor.activate(subject)
      expect(HeatmapStore.getLatest.mock.calls[0][1]).toEqual({
        filePath: 'qweqwiej'
      })
      expect(subject.activeHeatmapSimulation.heatmap).toEqual(
        Heatmap.create({
          time: 123
        })
      )
      expect(HeatmapSimulation.getActiveEffects(subject.activeHeatmapSimulation)).toEqual([
        CursorPositionEffect.create({
          filePath: 'qweqwiej',
          cursorLine: 0,
          cursorColumn: 0
        })
      ])
      expect(subject.activeHeatmapSimulation.timestep).toEqual(0.1)
    })

    it('does not activate the simulation', () => {
      // We clock the simulation in the HeatmapEditor.
      HeatmapSimulation.activate = jest.fn()
      HeatmapEditor.activate(subject)
      expect(HeatmapSimulation.activate.mock.calls.length).toEqual(0)
    })

    it ('starts iterating', () => {
      HeatmapEditor.activate(subject)
      expect(subject.iterateIntervalID).not.toBeNull()
    })

    describe('iteration', () => {
      // test('every 5000ms', (done) => {
      // })

      it('iterates the simulation every 100ms', (done) => {
        HeatmapEditor.activate(subject)
        setTimeout(() => {
          expect(subject.activeHeatmapSimulation.heatmap.time).toBeCloseTo(123.3)
          done()
        }, 333)
      })

      it('sets the active effects on the simulation every 200ms', () => {
        HeatmapSimulation.setActiveEffects = jest.fn()
        HeatmapEditor.activate(subject)
        setTimeout(() => {
          expect(HeatmapSimulation.setActiveEffects.mock.calls.length).toEqual(3)
          done()
        }, 666)
      })

      it('draws the heatmap every 5000ms', () => {
        subject.textEditor.setDecorations = jest.fn()
        HeatmapEditor.activate(subject)
        setTimeout(() => {
          expect(subject.textEditor.setDecorations.mock.calls.length).toEqual(1)
          done()
        }, 5555)
      })
    })
  })
})