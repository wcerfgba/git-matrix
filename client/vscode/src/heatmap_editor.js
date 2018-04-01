import * as vscode from 'vscode'
import * as HeatmapStore from './heatmap_store'
import * as HeatmapSimulation from '../vendor/eyeson-common/lib/heatmap_simulation'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'
import { isFalsey, range } from '../vendor/eyeson-common/lib/utils'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'

export const create = (o = {}) => {
  logMethod('HeatmapEditor.create')
  const heatmapEditor = {
    textEditor: o.textEditor,
    heatmapStore: o.heatmapStore,
    activeHeatmapSimulation: null,
    iterateIntervalID: null,
    iterateIntervalTimeout: 1000,
  }
  logReturn('dodgy unloggable here :(')
  return heatmapEditor
}

export const activate = (heatmapEditor) => {
  logMethod('HeatmapEditor.activate')
  const heatmap = HeatmapStore.getLatest(
    heatmapEditor.heatmapStore,
    { filePath: filePath(heatmapEditor) }
  )
  log('heatmap', heatmap)
  const heatmapSimulation = HeatmapSimulation.create({
    heatmap: heatmap,
    activeEffects: getActiveEffects(heatmapEditor)
  })
  log('heatmapSimulation', heatmapSimulation)
  //HeatmapSimulation.iterateToTime(heatmapSimulation, Date.now())
  HeatmapSimulation.activate(heatmapSimulation)
  heatmapEditor.activeHeatmapSimulation = heatmapSimulation

  heatmapEditor.iterateIntervalID = setInterval(
    () => iterate(heatmapEditor),
    heatmapEditor.iterateIntervalTimeout
  )
  logReturn()
}

export const deactivate = (heatmapEditor) => {
  logMethod('HeatmapEditor.deactivate')
  clearInterval(heatmapEditor.iterateIntervalTimeout)
  logReturn()
}

// TODO: iteration schedule
const iterate = (heatmapEditor) => {
  logMethod('HeatmapEditor.iterate')

  // TODO: better way to handle this?
  if (isFalsey(heatmapEditor.activeHeatmapSimulation)) {
    logReturn('falsey activeHeatmapSimulation')
    return
  }

  HeatmapSimulation.setActiveEffects(
    heatmapEditor.activeHeatmapSimulation,
    getActiveEffects(heatmapEditor)
  )

  // persist heatmap into store

  draw(heatmapEditor)

  logReturn()
}

const getActiveEffects = (heatmapEditor) => {
  logMethod('HeatmapEditor.getActiveEffects')
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
  logReturn(effects)
  return effects
}

const filePath = (heatmapEditor) => {
  const filePath = heatmapEditor.textEditor.document.fileName
  return filePath
}


// TODO: heatmap is behaving as expected but redrawing in vscode is slow/buggy,
// suggest decreasing frequency for drawing heatmap D:
const draw = (heatmapEditor) => {
  logMethod('HeatmapEditor.draw')
  //console.log(heatmapEditor) // TODO: better fucking logging, srs
  const heatmap = heatmapEditor.activeHeatmapSimulation.heatmap
  log('heatmap', heatmap)

  Heatmap.map(
    heatmap,
    entry => setHeatmapEntryDecoration(heatmapEditor.textEditor, entry)
  )

  logReturn()
}


// TODO:
//   some tests
//   persist state
//   sync state to server
//   more effects


const setHeatmapEntryDecoration = (
	editor,
  [lineNumber, heatQuantity]	
) => {
  logMethod('HeatmapEditor.setHeatmapEntryDecoration')
  //console.log(editor)
  log('[lineNumber, heatQuantity]', [lineNumber, heatQuantity])
  const colorIndex = Math.floor(Math.min(Math.max(0, heatQuantity), 255))
  const decorationType = decorationTypes[colorIndex]
  const decorationRanges = [
    new vscode.Range(
      new vscode.Position(lineNumber, 0),
      new vscode.Position(lineNumber, 0)
    )
  ]
	editor.setDecorations(decorationType, decorationRanges)
  logReturn()
}

const decorationTypes = range(0, 256).map(i => {
  return vscode.window.createTextEditorDecorationType({
    overviewRulerColor: `rgba(${i}, 0, 0, 1.0)`,
    overviewRulerLane: vscode.OverviewRulerLane.Left,
  })
})