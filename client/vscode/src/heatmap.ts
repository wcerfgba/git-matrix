import * as heatmap from '../../../common/src/heatmap'
import * as vscode from 'vscode'
import * as fetch 'isomorphic-fetch'

export const get = (config : any) =>
	fetch(`${config.server}/heatmap`)
		.then(response => heatmap.Heatmap(response.json()))

export const draw = (hm : heatmap.HeatmapT, editor : vscode.TextEditor) => {
  heatmap.entries(hm).forEach(entry => setHeatmapEntryDecoration(editor, entry))
}

const setHeatmapEntryDecoration = (
	editor : vscode.TextEditor,
  [fileLine, heatQuantity] : heatmap.HeatmapEntryT
) => {
	editor.setDecorations(
		vscode.window.createTextEditorDecorationType({
			overviewRulerColor: `rgba(${fileLine.lineNumber * 2}, 0, 0, 1.0)`,
			overviewRulerLane: vscode.OverviewRulerLane.Left,
		}),
		[{
      range: new vscode.Range(
        new vscode.Position(fileLine.lineNumber, 0),
        new vscode.Position(fileLine.lineNumber, 0)
      )
    }]
	)
} 