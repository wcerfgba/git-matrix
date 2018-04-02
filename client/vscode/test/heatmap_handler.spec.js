import * as HeatmapHandler from '../src/heatmap_handler'
import * as HeatmapStore from '../src/heatmap_store'
import * as Heatmap from '../vendor/eyeson-common/src/heatmap'
import * as HeatmapSimulation from '../vendor/eyeson-common/src/heatmap_simulation'
import { CursorPositionEffect } from '../vendor/eyeson-common/src/effects'

describe('HeatmapHandler', () => {
  describe('activate', () => {
    let subject

    const textEditor = {
      document: {
        fileName: 'qweqwiej'  //dfpot
      },
      _visibleRanges: [],
      selection: {
        active: {
          line: 0,
          character: 0
        }
      }
    }

    beforeEach(() => {
      subject = HeatmapHandler.create({
        textDocument: {
          fileName: 'sdfsdf'
        },
        textEditor: null, 
      })
    })

    it('initializes the simulation with the latest heatmap for the file and the correct timestep', () => {
      HeatmapStore.getLatest = jest.fn((heatmapStore, query) => {
        return Heatmap.create({
          time: 123
        })
      })
      HeatmapHandler.activate(subject)
      expect(HeatmapStore.getLatest.mock.calls[0][1]).toEqual({
        filePath: 'sdfsdf'
      })
      expect(subject.activeHeatmapSimulation.heatmap).toEqual(
        Heatmap.create({
          time: 123
        })
      )
      expect(subject.activeHeatmapSimulation.timestep).toEqual(0.1)
    })

    it('without a textEditor, initializes no active effects', () => {
      subject.textEditor = null
      HeatmapStore.getLatest = jest.fn((heatmapStore, query) => {
        return Heatmap.create({
          time: 123
        })
      })
      HeatmapHandler.activate(subject)
      const activeEffects = JSON.stringify(HeatmapSimulation.getActiveEffects(subject.activeHeatmapSimulation))
      const expectedActiveEffects = JSON.stringify([])
      expect(activeEffects).toEqual(expectedActiveEffects)
    })

    it('with a textEditor, initializes with some active effects', () => {
      subject.textEditor = textEditor
      HeatmapStore.getLatest = jest.fn((heatmapStore, query) => {
        return Heatmap.create({
          time: 123
        })
      })
      HeatmapHandler.activate(subject)
      const activeEffects = JSON.stringify(HeatmapSimulation.getActiveEffects(subject.activeHeatmapSimulation))
      const expectedActiveEffects = JSON.stringify([
        CursorPositionEffect.create({
          filePath: 'sdfsdf',
          cursorLine: 0,
          cursorColumn: 0
        })
      ])
      expect(activeEffects).toEqual(expectedActiveEffects)
    })

    it('does not activate the simulation', () => {
      // We clock the simulation in the HeatmapHandler.
      HeatmapSimulation.activate = jest.fn()
      HeatmapHandler.activate(subject)
      expect(HeatmapSimulation.activate.mock.calls.length).toEqual(0)
    })

    it ('starts iterating', () => {
      HeatmapHandler.activate(subject)
      expect(subject.iterateIntervalID).not.toBeNull()
    })

    // it('iterates every 5000ms', (done) => {
    // })

    it('iterates the simulation every 100ms', (done) => {
      HeatmapHandler.activate(subject)
      setTimeout(() => {
        expect(subject.activeHeatmapSimulation.heatmap.time).toBeCloseTo(123.3)
        done()
      }, 333)
    })

    it('sets the active effects on the simulation every 200ms', () => {
      HeatmapSimulation.setActiveEffects = jest.fn()
      HeatmapHandler.activate(subject)
      setTimeout(() => {
        expect(HeatmapSimulation.setActiveEffects.mock.calls.length).toEqual(3)
        done()
      }, 666)
    })

    it('with a textEditor, draws the heatmap every 5000ms', () => {
      subject.textEditor = textEditor
      subject.textEditor.setDecorations = jest.fn()
      HeatmapHandler.activate(subject)
      setTimeout(() => {
        expect(subject.textEditor.setDecorations.mock.calls.length).toEqual(1)
        done()
      }, 5555)
    })

    it('without a textEditor, does not draw the heatmap', () => {
      subject.textEditor = null
      HeatmapHandler.activate(subject)
      setTimeout(() => {
        expect(subject.textEditor.setDecorations.mock.calls.length).toEqual(0)
        done()
      }, 5555)
    })
  })
})