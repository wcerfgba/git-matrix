import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as vscode from 'vscode'
import { on } from '../vendor/eyeson-common/lib/event_listener'

export const create = (o) => {
  const heatmapUIHandler = {
    heatmapHandler: o.heatmapHandler,
    editorHandler: o.editorHandler
  }
  // TODO: debounce
  on(heatmapUIHandler.heatmapHandler, 'HeatmapIterated',
    (heatmap) => draw(heatmapUIHandler))
  // TODO: if active editor changes, how do i determine what heatmap i should
  // have?
  //
  // the client needs a store (even if just cache), which allows us to work with
  // multiple heatmaps, and get the correct heatmap when the textdocument 
  // changes :D
  return heatmapUIHandler
}

const draw = (heatmapUIHandler) => {
  // TODO: better handling of transience
  console.log(heatmapUIHandler.heatmapHandler.heatmap)
  console.log(heatmapUIHandler.editorHandler)
  if (!heatmapUIHandler.editorHandler.activeEditor) { return; }
  Heatmap.map(
    heatmapUIHandler.heatmapHandler.heatmap,
    entry => setHeatmapEntryDecoration(
      heatmapUIHandler.editorHandler.activeEditor,
      entry
    )
  )
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