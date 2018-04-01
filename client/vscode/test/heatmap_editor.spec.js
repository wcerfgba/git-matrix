import * as HeatmapEditor from '../src/heatmap_editor'
import * as HeatmapStore from '../src/heatmap_store'
import * as Heatmap from '../vendor/eyeson-common/src/heatmap'

describe('HeatmapEditor', () => {
  describe('activate', () => {
    const subject = HeatmapEditor.create({
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

    it('initializes the simulation with the latest heatmap for the file', () => {
      HeatmapStore.getLatest = jest.fn((heatmapStore, query) => {
        return Heatmap.create({
          time: 123
        })
      })
      HeatmapEditor.activate(subject)
      expect(subject.activeHeatmapSimulation.heatmap).toEqual(
        Heatmap.create({
          time: 123
        })
      )
    })

    it('creates the correct active effects', () => {

    })

    
  })
})