import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as NetworkHandler from './network_handler'
import * as EditorHandler from './editor_handler'
import * as EffectsHandler from './effects_handler'
import * as HeatmapStore from './heatmap_store'
import * as HeatmapUIHandler from './heatmap_ui_handler'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { assert } from '../vendor/eyeson-common/lib/utils'

export const create = (o = {}) => {
	return {
		active: false,
		extensionContext: o.extensionContext,
		editorHandler: null,
		effectsHandler: null,
		heatmapStore: null,
		heatmapUIHandler: null
	}
}

export const activate = async (heatmapFeature) => {
	assert(heatmapFeature.active === false, "Cannot activate already-active heatmap feature.")
	heatmapFeature.active = true
	heatmapFeature.editorHandler = EditorHandler.create({
		extensionContext: heatmapFeature.extensionContext
	})
	heatmapFeature.effectsHandler = EffectsHandler.create()
	heatmapFeature.heatmapStore = HeatmapStore.create()
	await HeatmapStore.sync(heatmapFeature.heatmapStore)
	heatmapFeature.heatmapUIHandler = HeatmapUIHandler.create({
		editorHandler: heatmapFeature.editorHandler,
		heatmapStore: heatmapFeature.heatmapStore,
		effectsHandler: heatmapFeature.effectsHandler
	})
}

export const deactivate = (heatmapFeature) => {	
	// TODO
}
