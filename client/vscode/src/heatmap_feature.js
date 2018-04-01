import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as EditorEffectsHandler from './editor_effects_handler'
import * as HeatmapStore from './heatmap_store'
import * as HeatmapUIHandler from './heatmap_ui_handler'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { assert } from '../vendor/eyeson-common/lib/utils'

export const create = (o = {}) => {
	return {
		active: false,
		extensionContext: o.extensionContext,
		heatmapStore: null,
		activeHeatmapEditors: Set()
	}
}

export const activate = async (heatmapFeature) => {
	assert(heatmapFeature.active === false, "Cannot activate already-active heatmap feature.")
	heatmapFeature.active = true

	heatmapFeature.heatmapStore = HeatmapStore.create()
	// TODO: should be activate, start a timer 
	await HeatmapStore.sync(heatmapFeature.heatmapStore)

	vscode.window.onDidChangeVisibleTextEditors(
    () => synchronizeActiveHeatmapEditors(heatmapFeature),
    null,
    editorEffectsHandler.extensionContext.subscriptions
  )

	synchronizeActiveHeatmapEditors(heatmapFeature)

	// heatmapFeature.editorEffectsHandler = EditorEffectsHandler.create({
	// 	extensionContext: heatmapFeature.extensionContext
	// })
	// EditorEffectsHandler.init(heatmapFeature.editorEffectsHandler)
	
	// heatmapFeature.heatmapUIHandler = HeatmapUIHandler.create({
	// 	editorEffectsHandler: heatmapFeature.editorEffectsHandler,
	// 	heatmapStore: heatmapFeature.heatmapStore,
	// })
	// HeatmapUIHandler.init(heatmapFeature.heatmapUIHandler)
}

export const deactivate = (heatmapFeature) => {	
	// TODO
}

const synchronizeActiveHeatmapEditors = (heatmapFeature) => {
	const newActiveHeatmapEditors =
		vscode.window.visibleTextEditors.map(
			(textEditor) => {
				const heatmapEditor = HeatmapEditor.create({
					textEditor: textEditor,
					heatmapStore: heatmapFeature.heatmapStore
				})
				return heatmapEditor
			}
		)
	heatmapFeature.activeHeatmapEditors.map(HeatmapEditor.deactivate)
	heatmapFeature.activeHeatmapEditors = newActiveHeatmapEditors
}

