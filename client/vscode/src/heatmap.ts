import * as vscode from 'vscode'

export const heatmap = (editor : vscode.TextEditor) => {
  for (let i = 1; i < editor.document.lineCount; i++) {
    setHeatmapLineDecoration(editor, i)
  }
}

const setHeatmapLineDecoration = (
	editor : vscode.TextEditor,
	lineNumber : number // TODO: should be HeatmapEntry
) => {
	editor.setDecorations(
		vscode.window.createTextEditorDecorationType({
			overviewRulerColor: `rgba(${lineNumber * 2}, 0, 0, 1.0)`,
			overviewRulerLane: vscode.OverviewRulerLane.Left,
		}),
		[{
      range: new vscode.Range(
        new vscode.Position(lineNumber, 0),
        new vscode.Position(lineNumber, 0)
      )
    }]
	)
} 