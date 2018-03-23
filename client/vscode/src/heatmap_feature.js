import * as Heatmap from '../../../common/lib/heatmap'
import * as EffectsHandler from './effects_handler'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { assert } from './utils'

export const create = (o) => {
	return {
		active: false,
		editorHandler: null,
		effectsHandler: null,
		heatmapHandler: null,
		heatmapUIHandler: null
	}
}

export const activate = (heatmapFeature) => {
	assert(heatmapFeature.active === false, "Cannot activate already-active heatmap feature.")
	heatmapFeature.active = true
	heatmapFeature.editorHandler = EditorHandler.create()
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

