import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as HeatmapHandler from './heatmap_handler'
import * as HeatmapStore from './heatmap_store'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { Map } from 'immutable'
import { assert } from '../vendor/eyeson-common/lib/utils'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'

export const create = (o = {}) => {
	return {
		active: false,
		extensionContext: o.extensionContext,
		heatmapStore: null,
		heatmapHandlersByFilePath: Map()
	}
}

export const activate = async (heatmapFeature) => {
	assert(heatmapFeature.active === false, "Cannot activate already-active heatmap feature.")
	heatmapFeature.active = true

	heatmapFeature.heatmapStore = HeatmapStore.create()
	// TODO: should be activate / start a timer? 
	await HeatmapStore.sync(heatmapFeature.heatmapStore)

	vscode.workspace.onDidOpenTextDocument(
		() => synchronize(heatmapFeature),
		null,
		heatmapFeature.extensionContext.subscriptions
	)

	vscode.workspace.onDidCloseTextDocument(
		() => synchronize(heatmapFeature),
		null,
		heatmapFeature.extensionContext.subscriptions
	)

	vscode.window.onDidChangeVisibleTextEditors(
    () => synchronize(heatmapFeature),
    null,
    heatmapFeature.extensionContext.subscriptions
  )

	synchronize(heatmapFeature)
}

export const deactivate = (heatmapFeature) => {	
	// TODO
}

export const synchronize = (heatmapFeature) => {
	logMethod('HeatmapFeature.synchronize')

	const textEditorsByFilePath = Map(
		vscode.window.visibleTextEditors.map(
			textEditor => [ textEditor.document.fileName, textEditor ]
		)
	)

	// We will look for HeatmapHandlers that are still managing open 
	// TextDocuments, and we will remove any unused HeatmapHandlers.
	let unusedHeatmapHandlersByFilePath = Map(heatmapFeature.heatmapHandlersByFilePath)

	const newHeatmapHandlers = 
		// We should have one HeatmapHandler for every open TextDocument.
		vscode.workspace.textDocuments.map(textDocument => {
			const filePath = textDocument.fileName
			
			let handler =	heatmapFeature.heatmapHandlersByFilePath.get(filePath)
			handler = handler || HeatmapHandler.create({
				textDocument: textDocument,
				heatmapStore: heatmapFeature.heatmapStore
			})

			// Set the TextEditor if if is available: indicates visibility.
			const editorForHandler = textEditorsByFilePath.get(filePath)
			HeatmapHandler.setTextEditor(handler, editorForHandler)

			unusedHeatmapHandlersByFilePath = unusedHeatmapHandlersByFilePath.delete(filePath)

			return handler
		})
	const newHeatmapHandlersByFilePath = Map(
		newHeatmapHandlers.map(
			heatmapHandler => [ HeatmapHandler.filePath(heatmapHandler), heatmapHandler ]
		)
	)

	unusedHeatmapHandlersByFilePath.valueSeq().map(HeatmapHandler.deactivate)
	newHeatmapHandlersByFilePath.valueSeq().map(HeatmapHandler.activate)
	heatmapFeature.heatmapHandlersByFilePath = newHeatmapHandlersByFilePath

	log('heatmapHandlersByFilePath', heatmapFeature.heatmapHandlersByFilePath)
	logReturn()
}

