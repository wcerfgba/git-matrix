export const create = (o) => {
  const editorHandler = {
    activeEditor: null
  }
  editorHandler.activeEditor = setActiveEditor(editorHandler, o.activeEditor)
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => setActiveEditor(editorHandler, editor),
    null,
    context.subscriptions
  )
}

const setActiveEditor = (editorHandler, editor) => {
  editorHandler.activeEditor = editor || vscode.window.activeTextEditor
}