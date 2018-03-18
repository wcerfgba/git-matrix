import * as vscode from 'vscode'
import * as heatmap from './heatmap'

export class EditorHandler {
	editor : vscode.TextEditor

	init = (context : vscode.ExtensionContext) => {
		vscode.window.onDidChangeActiveTextEditor(
			this.setEditor,
			null,
			context.subscriptions
		)
		this.setEditor()
	}

	setEditor = () => {
		this.editor = vscode.window.activeTextEditor
	}
}

const config = {
	server: 'localhost:3000'
}

const editorHandler = new EditorHandler()

export const activate = (context : vscode.ExtensionContext) => {
	editorHandler.init(context)
	vscode.workspace.onDidChangeTextDocument(event => {
		const editor = editorHandler.editor
		if (editor && event.document === editor.document) {
			getAndDrawHeatmap(editor)
		}
	}, null, context.subscriptions)
}

export async function getAndDrawHeatmap(editor : vscode.TextEditor) {
	const hm = await heatmap.get(config)
	heatmap.draw(hm, editor)
}
