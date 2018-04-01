import * as vscode from 'vscode'
import { Map, Set } from 'immutable'
import { Effect, CursorPositionEffect, VisibleFileEffect } from '../vendor/eyeson-common/lib/effects'
import * as FileRange from '../vendor/eyeson-common/lib/file_range'
import { on, fire } from '../vendor/eyeson-common/lib/event_listener'
import { assert, isFalsey } from '../vendor/eyeson-common/lib/utils'

export const create = (o = {}) => {
  const editorEffectsHandler = {
    extensionContext: o.extensionContext,
    activeEditor: null,
    visibleEditors: [],
    visibleRanges: Set(),
    visibleRangesPollInterval: 1000,
    visibleRangesPollIntervalID: null,
    effects: Set(o.effects || []),
    iterateInterval: 1000,
    iterateIntervalID: null,
    iterateTimestep: 1,
    eventListeners: []
  }
  return editorEffectsHandler
}

export const init = (editorEffectsHandler) => {
  bindActiveEditor(editorEffectsHandler)
  bindVisibleEditors(editorEffectsHandler)
  bindVisibleRanges(editorEffectsHandler)
  on(editorEffectsHandler, 'ActiveEditorChanged',
    () => updateActiveEditorEffects(editorEffectsHandler))
  on(editorEffectsHandler, 'VisibleEditorsChanged',
    () => updateVisibleEditorsEffects(editorEffectsHandler))
  on(editorEffectsHandler, 'VisibleRangesChanged',
    () => updateVisibleRangesEffects(editorEffectsHandler))
  startIterate(editorEffectsHandler)
}

export const getActiveEffects = (editorEffectsHandler) => {
  const activeEffects =
    editorEffectsHandler.effects.filter(effect => effect.isActive)
  return activeEffects
}

const bindActiveEditor = (editorEffectsHandler) => {
  const setActiveEditor = (editorEffectsHandler) => {
    editorEffectsHandler.activeEditor = vscode.window.activeTextEditor
    fire(editorEffectsHandler, 'ActiveEditorChanged', editorEffectsHandler.activeEditor)
  }
  setActiveEditor(editorEffectsHandler)
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => setActiveEditor(editorEffectsHandler),
    null,
    editorEffectsHandler.extensionContext.subscriptions
  )
}

const bindVisibleEditors = (editorEffectsHandler) => {
  const setVisibleEditors = (editorEffectsHandler) => {
    editorEffectsHandler.visibleEditors = vscode.window.visibleTextEditors
    fire(editorEffectsHandler, 'VisibleEditorsChanged', editorEffectsHandler.visibleEditors)
  }
  setVisibleEditors(editorEffectsHandler)
  vscode.window.onDidChangeVisibleTextEditors(
    (editor) => setVisibleEditors(editorEffectsHandler),
    null,
    editorEffectsHandler.extensionContext.subscriptions
  )
}

const bindVisibleRanges = (editorEffectsHandler) => {
  const setVisibleRanges = (editorEffectsHandler) => {
    editorEffectsHandler.visibleRanges = Set(
      editorEffectsHandler.visibleEditors.map(
        editor => editor._visibleRanges.map(
          editorRange => FileRange.create({
            filePath: editor.document.fileName,
            fromLineNumber: editorRange.start.line,
            toLineNumber: editorRange.end.line
          })
        )
      ).reduce((acc, x) => [...acc, ...x], [])
    )
    fire(editorEffectsHandler, 'VisibleRangesChanged', editorEffectsHandler.visibleRanges)
  }
  setVisibleRanges(editorEffectsHandler)
  editorEffectsHandler.visibleRangesIntervalID = setInterval(
    () => setVisibleRanges(editorEffectsHandler),
    editorEffectsHandler.visibleRangesPollInterval
  )
}

// TODO: this code should live with the effects

const updateActiveEditorEffects = (editorEffectsHandler) => {
  editorEffectsHandler.effects =
    editorEffectsHandler.effects.map(effect => {
      if (effect.effectType === 'CursorPositionEffect' &&
          effect.isActive) {
        return { ...effect, isActive: false }
      }
      return effect
    }).add({
      ...CursorPositionEffect.create({
        filePath: editorEffectsHandler.activeEditor.document.fileName,
        cursorLine: editorEffectsHandler.activeEditor.selection.active.line,
        cursorColumn: editorEffectsHandler.activeEditor.selection.active.character
      }),
      isActive: true
    })
  fire(editorEffectsHandler, 'ActiveEffectsChanged', editorEffectsHandler.effects)
}

const updateVisibleEditorsEffects = (editorEffectsHandler) => { /* TODO? */ }

const updateVisibleRangesEffects = (editorEffectsHandler) => {
  let unprocessedRanges = Set(editorEffectsHandler.visibleRanges)
  editorEffectsHandler.effects =
    editorEffectsHandler.effects.map(effect => {
      if (effect.effectType === 'VisibleFileEffect') {
        const effectRange = FileRange.create({
          filePath: effect.filePath,
          fromLineNumber: effect.viewportTopLine,
          toLineNumber: effect.viewportBottomLine
        })
        unprocessedRanges = unprocessedRanges.delete(effectRange)
        return { ...effect, isActive: false }
      }
      return effect
    }).union(Set(unprocessedRanges.map(range => {
      return {
        ...VisibleFileEffect.create({
          filePath: range.filePath,
          viewportTopLine: range.fromLineNumber,
          viewportBottomLine: range.toLineNumber
        }),
        isActive: true
      }
    })))
  fire(editorEffectsHandler, 'ActiveEffectsChanged', editorEffectsHandler.effects)
}

// TODO: refactor store to live inside SCM!, it's just a folder in the root.

const startIterate = (editorEffectsHandler) => {
  assert(isFalsey(editorEffectsHandler.iterateIntervalID), "Already iterating, use 'EffectsHandler.stopIterate' first.")
  editorEffectsHandler.iterateIntervalID =
    setInterval(() => iterate(editorEffectsHandler), editorEffectsHandler.iterateInterval)
}

// TODO: stopIterate

const iterate = (editorEffectsHandler) => {
  editorEffectsHandler.effects =
    editorEffectsHandler.effects.map(
      (effect) => {
        if (effect.isActive) {
          return Effect.create({
            ...effect,
            toTime: effect.toTime + editorEffectsHandler.iterateTimestep
          })
        }
        return effect
      } 
    )

  // Events may have changed
  fire(editorEffectsHandler, 'ActiveEffectsChanged', editorEffectsHandler.effects)
  return editorEffectsHandler
}
