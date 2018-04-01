import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as HeatmapEditor from './heatmap_editor'
import * as HeatmapStore from './heatmap_store'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { Set } from 'immutable'
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
    heatmapFeature.extensionContext.subscriptions
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
	console.log('HeatmapFeature.synchronizeActiveHeatmapEditors', heatmapFeature)
	const newActiveHeatmapEditors =
		vscode.window.visibleTextEditors.map(
			(textEditor) => {
				const heatmapEditor = HeatmapEditor.create({
					textEditor: textEditor,
					heatmapStore: heatmapFeature.heatmapStore
				})
				console.log('heatmapEditor = ', heatmapEditor)
				return heatmapEditor
			}
		)
	heatmapFeature.activeHeatmapEditors.map(HeatmapEditor.deactivate)
	newActiveHeatmapEditors.map(HeatmapEditor.activate)
	heatmapFeature.activeHeatmapEditors = newActiveHeatmapEditors
	console.log('heatmapFeature.activeHeatmapEditors = ', heatmapFeature.activeHeatmapEditors)
}

