import * as vscode from 'vscode'

export const create = (o) => {
  const editorHandler = {
    extensionContext: o.extensionContext,
    activeEditor: null
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
}