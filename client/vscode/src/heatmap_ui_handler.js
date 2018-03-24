import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as vscode from 'vscode'
import * as Store from './store'
import { on } from '../vendor/eyeson-common/lib/event_listener'
import { assert, isTruthy } from '../vendor/eyeson-common/lib/utils'

export const create = (o) => {
  const heatmapUIHandler = {
    editorHandler: o.editorHandler,
    heatmapStore: o.heatmapStore,
  }
  on(heatmapUIHandler.heatmapStore, 'HeatmapIterated',
    (heatmap) => draw(heatmapUIHandler))
  return heatmapUIHandler
}

const draw = (heatmapUIHandler) => {
  const editor = heatmapUIHandler.editorHandler.activeEditor
  assert(isTruthy(editor), "No active editor.")
  const heatmap = getHeatmapForActiveEditor(heatmapUIHandler)
  Heatmap.map(
    heatmap,
    entry => setHeatmapEntryDecoration(editor, entry)
  )
}

const getHeatmapForActiveEditor = (heatmapUIHandler) => {
  const editor = heatmapUIHandler.editorHandler.activeEditor
  assert(isTruthy(editor), "No active editor.")
  const document = editor.document
  assert(isTruthy(document), "Active editor has no document.")
  const query = {
    projectName: '',
    vcsReference: '',
    filePath: document.uri // TODO: need to get relative to project root :/
  }
  const heatmap = Store.get(heatmapUIHandler.heatmapStore, query)
  return heatmap
}

const setHeatmapEntryDecoration = (
	editor,
  [fileLine, heatQuantity]	
) => {
	editor.setDecorations(
		vscode.window.createTextEditorDecorationType({
			overviewRulerColor: `rgba(${Math.floor(heatQuantity) * 2 % 255}, 0, 0, 1.0)`,
			overviewRulerLane: vscode.OverviewRulerLane.Left,
		}),
		[{ range: new vscode.Range(
        new vscode.Position(fileLine.lineNumber, 0),
        new vscode.Position(fileLine.lineNumber, 0)
		) }]
	)
} 