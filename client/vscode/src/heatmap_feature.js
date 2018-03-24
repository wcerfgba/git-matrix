import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as EditorHandler from './editor_handler'
import * as EffectsHandler from './effects_handler'
import * as HeatmapHandler from './heatmap_handler'
import * as HeatmapUIHandler from './heatmap_ui_handler'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { assert } from '../vendor/eyeson-common/lib/utils'

export const create = (o) => {
	return {
		active: false,
		extensionContext: o.extensionContext,
		editorHandler: null,
		effectsHandler: null,
		heatmapHandler: null,
		heatmapUIHandler: null
	}
}

export const activate = (heatmapFeature) => {
	assert(heatmapFeature.active === false, "Cannot activate already-active heatmap feature.")
	heatmapFeature.active = true
	heatmapFeature.editorHandler = EditorHandler.create({
		extensionContext: heatmapFeature.extensionContext
	})
	heatmapFeature.effectsHandler = EffectsHandler.create()
	heatmapFeature.heatmapHandler = HeatmapHandler.create({
		effectsHandler: heatmapFeature.effectsHandler
	})
	heatmapFeature.heatmapUIHandler = HeatmapUIHandler.create({
		editorHandler: heatmapFeature.editorHandler,
		heatmapHandler: heatmapFeature.heatmapHandler
	})
	HeatmapHandler.startIterate(heatmapFeature.heatmapHandler)
}

export const deactivate = (heatmapFeature) => {	
	// TODO
}


// TODO: put in a network handler
const get = ({ server }) =>
	fetch(`${server}/heatmap`)
		.then(response => response.json())
		.then(json => heatmap.create(json))
		.catch(log)

