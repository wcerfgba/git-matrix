import * as vscode from 'vscode'
import { fire } from '../vendor/eyeson-common/lib/event_listener'

export const create = (o) => {
  const editorHandler = {
    extensionContext: o.extensionContext,
    activeEditor: null,
    activeDocument: null,
    eventHandlers: []
  }
  editorHandler.activeEditor = setActiveEditor(editorHandler, editorHandler.activeEditor)
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => setActiveEditor(editorHandler, editor),
    null,
    editorHandler.extensionContext.subscriptions
  )
  return editorHandler
}

const setActiveEditor = (editorHandler, editor) => {
  editorHandler.activeEditor = editor || vscode.window.activeTextEditor
  fire(editorHandler, 'ActiveEditorChanged', editorHandler.activeEditor)
}