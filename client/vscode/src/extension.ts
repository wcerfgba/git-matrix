import * as vscode from 'vscode'
import { heatmap } from './heatmap'

export function activate(context: vscode.ExtensionContext) {
	let activeEditor = vscode.window.activeTextEditor
	if (activeEditor) {
		triggerUpdateDecorations()
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor
		if (editor) {
			triggerUpdateDecorations()
		}
	}, null, context.subscriptions)

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations()
		}
	}, null, context.subscriptions)

	let timeout = null
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(updateDecorations, 1000)
	}

	function updateDecorations() {
		if (!activeEditor) {
			return
		}
		heatmap(activeEditor)
	}
}

