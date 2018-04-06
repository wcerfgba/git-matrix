import * as vscode from 'vscode'
import * as HeatmapStore from './heatmap_store'
import * as HeatmapSimulation from '../vendor/eyeson-common/lib/heatmap_simulation'
import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import { VisibleFileEffect, CursorPositionEffect } from '../vendor/eyeson-common/lib/effects'
import { isFalsey, isTruthy } from '../vendor/eyeson-common/lib/utils'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'
import { Range } from 'immutable'

export const create = (o = {}) => {
  logMethod('HeatmapHandler.create')
  const heatmapHandler = {
    isActive: false,
    textDocument: o.textDocument,
    textEditor: o.textEditor,
    heatmapStore: o.heatmapStore,
    activeHeatmapSimulation: null,
    iterateIntervalID: null,
    iterateIntervalTimeout: 5000,
  }
  logReturn('dodgy unloggable here :(')
  return heatmapHandler
}

export const filePath = (heatmapHandler) => {
  return heatmapHandler.textDocument.fileName
}

export const activate = (heatmapHandler) => {
  logMethod('HeatmapHandler.activate')

  if (heatmapHandler.isActive) {
    logReturn('isActive')
    return
  }
  heatmapHandler.isActive = true

  const heatmap = HeatmapStore.getLatest(
    heatmapHandler.heatmapStore,
    { filePath: filePath(heatmapHandler) }
  )
  log('heatmap', heatmap)
  const heatmapSimulation = HeatmapSimulation.create({
    timestep: 0.1,
    heatmap: heatmap,
    activeEffects: getActiveEffects(heatmapHandler)
  })
  log('heatmapSimulation', heatmapSimulation)

  // We should probably advance...
  //HeatmapSimulation.iterateToTime(heatmapSimulation, Date.now())

  // ... but we iterate to our own interval
  //HeatmapSimulation.activate(heatmapSimulation)

  heatmapHandler.activeHeatmapSimulation = heatmapSimulation

  heatmapHandler.iterateIntervalID = setInterval(
    () => iterate(heatmapHandler),
    heatmapHandler.iterateIntervalTimeout
  )
  iterate(heatmapHandler)

  logReturn()
}

export const deactivate = (heatmapHandler) => {
  logMethod('HeatmapHandler.deactivate')
  heatmapHandler.isActive = false
  clearInterval(heatmapHandler.iterateIntervalTimeout)
  logReturn()
}

export const setTextEditor = (heatmapHandler, textEditor) => {
  heatmapHandler.textEditor = textEditor
}

const iterate = (heatmapHandler) => {
  logMethod('HeatmapHandler.iterate')

  // TODO: better way to handle this?
  if (isFalsey(heatmapHandler.activeHeatmapSimulation)) {
    logReturn('falsey activeHeatmapSimulation')
    return
  }

  let iterationCount = 1
  const shouldSetActiveEffects = () => iterationCount % 2 === 0
  const shouldDraw = () => {
    return (
      isTruthy(heatmapHandler.textEditor) &&
      iterationCount % 50 === 0
    )
  }
  timeoutChain(
    () => {
      logMethod('HeatmapHandler.iterate.timeoutChain')
      HeatmapSimulation.iterate(heatmapHandler.activeHeatmapSimulation)
      if (shouldSetActiveEffects()) {
        HeatmapSimulation.setActiveEffects(
          heatmapHandler.activeHeatmapSimulation,
          getActiveEffects(heatmapHandler)
        )
      }
      if (shouldDraw()) {
        draw(heatmapHandler)
      }
      // TODO: persist heatmap into store
      iterationCount = iterationCount + 1
      logReturn()
    },
    100,
    50
  )
  logReturn()
}

const timeoutChain = (cb, timeout, count) => {
  setTimeout(
    () => {
      cb()
      if (count > 0) {
        timeoutChain(cb, timeout, count - 1)
      }
    },
    timeout
  )
}

const getActiveEffects = (heatmapHandler) => {
  logMethod('HeatmapHandler.getActiveEffects')
  let effects = []
  if (isTruthy(heatmapHandler.textEditor)) {
    effects = effects.concat([
      ...heatmapHandler.textEditor._visibleRanges.map(
        (range) => VisibleFileEffect.create({
          filePath: filePath(heatmapHandler),
          viewportTopLine: range.start.line,
          viewportBottomLine: range.end.line
        })
      )
    ])
    effects = effects.concat([
      CursorPositionEffect.create({
        filePath: filePath(heatmapHandler),
        cursorLine: heatmapHandler.textEditor.selection.active.line,
        cursorColumn: heatmapHandler.textEditor.selection.active.character
      })
    ])
  }
  // TODO: OpenFileEffect
  logReturn(effects)
  return effects
}

const draw = (heatmapHandler) => {
  logMethod('HeatmapHandler.draw')
  const heatmap = heatmapHandler.activeHeatmapSimulation.heatmap
  log('heatmap', heatmap)

  Heatmap.map(
    heatmap,
    entry => setHeatmapEntryDecoration(heatmapHandler.textEditor, entry)
  )

  logReturn()
}


// TODO:
//   persist state
//   sync state to server
//   more effects


const setHeatmapEntryDecoration = (
	editor,
  [lineNumber, heatQuantity]	
) => {
  logMethod('HeatmapHandler.setHeatmapEntryDecoration')
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

const decorationTypes = Range(0, 256).map(i => {
  return vscode.window.createTextEditorDecorationType({
    overviewRulerColor: `rgba(${i}, 0, 0, 1.0)`,
    overviewRulerLane: vscode.OverviewRulerLane.Left,
  })
}).toArray()