import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as vscode from 'vscode'
import * as HeatmapStore from './heatmap_store'
import * as HeatmapSimulation from '../vendor/eyeson-common/lib/heatmap_simulation'
import * as EditorEffectsHandler from './editor_effects_handler'
import { on } from '../vendor/eyeson-common/lib/event_listener'
import { assert, isTruthy, logThrows } from '../vendor/eyeson-common/lib/utils'

export const create = (o = {}) => {
  const heatmapUIHandler = {
    heatmapStore: o.heatmapStore,
    editorEffectsHandler: o.editorEffectsHandler,
    activeEffects: null,
    activeHeatmap: null,
    activeSimulation: null
  }
  return heatmapUIHandler
}

export const init = (heatmapUIHandler) => {
  on(heatmapUIHandler.editorEffectsHandler, 'ActiveEffectsChanged',
    (effects) => setActiveEffects(heatmapUIHandler))
  on(heatmapUIHandler.heatmapStore, 'DocumentsChanged',
    () => setActiveHeatmap(heatmapUIHandler))
  on(heatmapUIHandler.editorEffectsHandler, 'ActiveEditorChanged',
    (editor) => setActiveHeatmap(heatmapUIHandler))
  // setActiveEffects(heatmapUIHandler)
  // setActiveHeatmap(heatmapUIHandler)
  // setActiveSimulation(heatmapUIHandler)
}

const setActiveEffects = logThrows((heatmapUIHandler) => {
  heatmapUIHandler.activeEffects = 
    EditorEffectsHandler.getActiveEffects(heatmapUIHandler.editorEffectsHandler)
  HeatmapSimulation.setActiveEffects(
    heatmapUIHandler.heatmapSimulation,
    heatmapUIHandler.activeEffects
  )
})

const setActiveHeatmap = logThrows((heatmapUIHandler) => {
  const activeEditor = heatmapUIHandler.editorEffectsHandler.activeEditor
  assert(isTruthy(activeEditor), "No active editor.")
  const document = activeEditor.document
  assert(isTruthy(document), "Active editor has no document.")
  const filePath = document.uri.path
  const heatmap = HeatmapStore.findLatest(heatmapUIHandler.heatmapStore, {
    projectName: '',
    vcsReference: '',
    filePath, // TODO: need to get relative to project root :/
  })
  console.log('dat map', heatmap)
  heatmapUIHandler.activeHeatmap = heatmap
  setActiveSimulation(heatmapUIHandler)
})

const setActiveSimulation = logThrows((heatmapUIHandler) => {
  assert(isTruthy(heatmapUIHandler.activeHeatmap), "No active heatmap.")
  const heatmapSimulation = HeatmapSimulation.create({
    heatmap: heatmapUIHandler.activeHeatmap,
    activeEffects: heatmapUIHandler.activeEffects
  })
  //HeatmapSimulation.iterateToTime(heatmapSimulation, Date.now())
  on(heatmapSimulation, 'HeatmapSimulationIterated',
    (heatmapSimulation) => draw(heatmapUIHandler))
  heatmapUIHandler.activeSimulation = heatmapSimulation
  //draw(heatmapUIHandler)
  HeatmapSimulation.startIterate(heatmapUIHandler.activeSimulation)
})

const draw = logThrows((heatmapUIHandler) => {
  const editor = heatmapUIHandler.editorEffectsHandler.activeEditor
  assert(isTruthy(editor), "No active editor.")
  const heatmap = heatmapUIHandler.activeSimulation.heatmap

  console.log('draw @ ', Date.now())
  console.log(heatmap)

  Heatmap.map(
    heatmap,
    entry => setHeatmapEntryDecoration(editor, entry)
  )
})

const setHeatmapEntryDecoration = (
	editor,
  [lineNumber, heatQuantity]	
) => {
	editor.setDecorations(
		vscode.window.createTextEditorDecorationType({
			overviewRulerColor: `rgba(${Math.floor(heatQuantity) * 2 % 255}, 0, 0, 1.0)`,
			overviewRulerLane: vscode.OverviewRulerLane.Left,
		}),
		[{ range: new vscode.Range(
        new vscode.Position(lineNumber.lineNumber, 0),
        new vscode.Position(lineNumber.lineNumber, 0)
		) }]
	)
} 