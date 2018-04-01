import * as vscode from 'vscode'
import * as HeatmapStore from './heatmap_store'
import * as HeatmapSimulation from '../vendor/eyeson-common/lib/heatmap_simulation'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'
import { isFalsey, range } from '../vendor/eyeson-common/lib/utils'

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
  const heatmap = HeatmapStore.getLatest(
    heatmapEditor.heatmapStore,
    { filePath: filePath(heatmapEditor) }
  )
  const heatmapSimulation = HeatmapSimulation.create({
    heatmap: heatmap,
    activeEffects: getActiveEffects(heatmapEditor)
  })
  //HeatmapSimulation.iterateToTime(heatmapSimulation, Date.now())
  HeatmapSimulation.activate(heatmapSimulation)
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
  console.log('HeatmapEditor.iterate')
  //console.log(heatmapEditor)
  if (isFalsey(heatmapEditor.activeHeatmapSimulation)) {
    console.log('return // falsey activeHeatmapSimulation')
    return
  }

  HeatmapSimulation.setActiveEffects(
    heatmapEditor.activeHeatmapSimulation,
    getActiveEffects(heatmapEditor)
  )

  // persist heatmap into store

  draw(heatmapEditor)
}

const getActiveEffects = (heatmapEditor) => {
  console.log('HeatmapEditor.getActiveEffects')
  //console.log(heatmapEditor)
  const effects = [
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
  console.log('return ', effects)
  return effects
}

const filePath = (heatmapEditor) => {
  const filePath = heatmapEditor.textEditor.document.fileName
  return filePath
}

const draw = (heatmapEditor) => {
  console.log('HeatmapEditor.draw')
  //console.log(heatmapEditor) // TODO: better fucking logging, srs
  const heatmap = heatmapEditor.activeHeatmapSimulation.heatmap
  console.log('heatmap = ', heatmap)

  Heatmap.map(
    heatmap,
    entry => setHeatmapEntryDecoration(heatmapEditor.textEditor, entry)
  )
}


// TODO:
//   better way than lots of decoration types, i don't trust this any more
//   better logging
//   some tests
//   cleanup
//   persist state
//   sync state to server
//   more effects


const setHeatmapEntryDecoration = (
	editor,
  [lineNumber, heatQuantity]	
) => {
  console.log('HeatmapEditor.setHeatmapEntryDecoration')
  //console.log(editor)
  console.log([lineNumber, heatQuantity])
  const colorIndex = Math.min(Math.floor(heatQuantity * 10), 255)
  const decorationType = decorationTypes[colorIndex]
  const decorationRanges = [
    new vscode.Range(
      new vscode.Position(lineNumber, 0),
      new vscode.Position(lineNumber, 0)
    )
  ]
  //console.log('decorationRanges = ', decorationRanges)
	editor.setDecorations(decorationType, decorationRanges)
}

const decorationTypes = range(0, 256).map(i => {
  return vscode.window.createTextEditorDecorationType({
    overviewRulerColor: `rgba(${i}, 0, 0, 1.0)`,
    overviewRulerLane: vscode.OverviewRulerLane.Left,
  })
})