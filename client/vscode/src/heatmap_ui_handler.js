import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as vscode from 'vscode'
import * as Store from './store'
import { on } from '../vendor/eyeson-common/lib/event_listener'
import { assert, isTruthy } from '../vendor/eyeson-common/lib/utils'

export const create = (o) => {
  const heatmapUIHandler = {
    editorHandler: o.editorHandler,
    heatmapStore: o.heatmapStore,
    activeSimulation: null
  }
  on(heatmapUIHandler.editorHandler, 'ActiveEditorChanged',
    (editor) => setActiveSimulation(heatmapUIHandler))
  setActiveSimulation(heatmapUIHandler)
  return heatmapUIHandler
}

const setActiveSimulation = (heatmapUIHandler) => {
  const activeEditor = heatmapUIHandler.editorHandler.activeEditor
  assert(isTruthy(activeEditor), "No active editor.")
  const document = activeEditor.document
  assert(isTruthy(document), "Active editor has no document.")
  const query = {
    projectName: '',
    vcsReference: '',
    filePath: document.uri, // TODO: need to get relative to project root :/
  }
  // TODO: sorting/ordering in Store API, better than this cos this is grim
  const heatmaps = Store.find(heatmapUIHandler.heatmapStore, query)
  heatmaps.sort((a, b) => a.time - b.time)
  const heatmap = heatmaps.pop()
  const heatmapSimulation = HeatmapSimulation.create({
    heatmap: heatmap,
    activeEffects: [], // TODO
  })
  HeatmapSimulation.iterateToTime(heatmapSimulation, Date.now())
  on(heatmapSimulation, 'HeatmapIterated',
    (heatmap) => draw(heatmapUIHandler))
  HeatmapSimulation.startIterate(heatmapSimulation)
  heatmapUIHandler.activeSimulation = heatmapSimulation
}

const draw = (heatmapUIHandler) => {
  const activeEditor = heatmapUIHandler.editorHandler.activeEditor
  assert(isTruthy(editor), "No active editor.")
  const heatmap = getHeatmapForActiveEditor(heatmapUIHandler)
  Heatmap.map(
    heatmap,
    entry => setHeatmapEntryDecoration(editor, entry)
  )
}

const getHeatmapForActiveEditor = (heatmapUIHandler) => {
  const editor = heatmapUIHandler.editorHandler.activeEditor
  
  return heatmap
}

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