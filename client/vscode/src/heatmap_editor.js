import { VisibleFileEffect } from "../../../common/src/effects";
import { CursorPositionEffect } from "../vendor/eyeson-common/lib/effects";

export const create = (o = {}) => {
  const heatmapEditor = {
    textEditor: o.textEditor,
    heatmapStore: o.heatmapStore,
    activeHeatmapSimulation: null,
    iterateIntervalID: null,
    iterateIntervalTimeout: 1000,
  }
  return heatmapEditor
}

export const activate = (heatmapEditor) => {
  const heatmap = HeatmapStore.getLatest({
    filePath: filePath(heatmapEditor)
  })
  const heatmapSimulation = HeatmapSimulation.create({
    heatmap: heatmap,
    activeEffects: getActiveEffects(heatmapEditor)
  })
  //HeatmapSimulation.iterateToTime(heatmapSimulation, Date.now())
  HeatmapSimulation.activate(heatmapUIHandler.activeSimulation)
  heatmapEditor.activeHeatmapSimulation = heatmapSimulation

  heatmapEditor.iterateIntervalID = setInterval(
    () => iterate(heatmapEditor),
    heatmapEditor.iterateIntervalTimeout
  )
}

export const deactivate = (heatmapEditor) => {
  clearInterval(heatmapEditor.iterateIntervalTimeout)
}

// TODO: iteration schedule
const iterate = (heatmapEditor) => {
  HeatmapSimulation.setActiveEffects(
    heatmapEditor.activeHeatmapSimulation,
    getActiveEffects(heatmapEditor)
  )

  // persist heatmap into store

  draw(heatmapEditor)
}

const getActiveEffects = (heatmapEditor) => {
  return [
    ...heatmapEditor.textEditor._visibleRanges.map(
      (range) => VisibleFileEffect.create({
        filePath: filePath(heatmapEditor),
        viewportTopLine: range.start.line,
        viewportBottomLine: range.end.line
      })
    ),
    CursorPositionEffect.create({
      filePath: filePath(heatmapEditor),
      cursorLine: heatmapEditor.textEditor.selection.active.line,
      cursorColumn: heatmapEditor.textEditor.selection.active.character
    })
  ]
}

const filePath = (heatmapEditor) => {
  const filePath = heatmapEditor.textEditor.document.fileName
  return filePath
}

const draw = logThrows((heatmapEditor) => {
  const heatmap = heatmapEditor.activeHeatmapSimulation.heatmap

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