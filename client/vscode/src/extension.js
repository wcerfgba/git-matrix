import * as vscode from 'vscode'
import * as heatmap from './heatmap'
import { log } from './utils'

const config = {
	server: 'http://localhost:3000'
}

export class EditorHandler {
	editor
	heatmap

	init = (context) => {
		vscode.window.onDidChangeActiveTextEditor(
			this.onDidChangeActiveTextEditor,
			null,
			context.subscriptions
		)
		this.setEditor()
		this.getHeatmap()
	}

	onDidChangeActiveTextEditor = () => {
		this.setEditor()
		this.getHeatmap()
	}

	setEditor = () => {
		this.editor = vscode.window.activeTextEditor
	}

	getHeatmap = () => {
		heatmap.get(config)
			.then(heatmap => this.heatmap = heatmap)
			.then(() => log(this.heatmap))
			.then(() =>	heatmap.draw(this.heatmap, this.editor))
			.catch(log)
	}
}

const editorHandler = new EditorHandler()

export const activate = (context) => {
	editorHandler.init(context)
	vscode.workspace.onDidChangeTextDocument(event => {
		const editor = editorHandler.editor
		if (editor && event.document === editor.document) {
			editorHandler.getHeatmap()
		}
	}, null, context.subscriptions)
}