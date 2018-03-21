import * as heatmap from '../../../common/lib/heatmap'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { log } from './utils'

export const get = ({ server }) =>
	fetch(`${server}/heatmap`)
		.then(response => response.json())
		.then(json => heatmap.create(json))
		.catch(log)

export const draw = (hm, editor) => {
  heatmap.entries(hm).forEach(entry => setHeatmapEntryDecoration(editor, entry))
}

const setHeatmapEntryDecoration = (
	editor,
  [fileLine, heatQuantity]	
) => {
	editor.setDecorations(
		vscode.window.createTextEditorDecorationType({
			overviewRulerColor: `rgba(${heatQuantity * 2}, 0, 0, 1.0)`,
			overviewRulerLane: vscode.OverviewRulerLane.Left,
		}),
		[{ range: new vscode.Range(
        new vscode.Position(fileLine.lineNumber, 0),
        new vscode.Position(fileLine.lineNumber, 0)
		) }]
	)
} 