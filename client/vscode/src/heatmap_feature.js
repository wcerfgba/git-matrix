import * as Heatmap from '../vendor/eyeson-common/lib/heatmap'
import * as HeatmapEditor from './heatmap_editor'
import * as HeatmapStore from './heatmap_store'
import * as vscode from 'vscode'
import 'isomorphic-fetch'
import { Set } from 'immutable'
import { assert } from '../vendor/eyeson-common/lib/utils'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'

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
}

export const deactivate = (heatmapFeature) => {	
	// TODO
}

const synchronizeActiveHeatmapEditors = (heatmapFeature) => {
	logMethod('HeatmapFeature.synchronizeActiveHeatmapEditors')

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
	newActiveHeatmapEditors.map(HeatmapEditor.activate)
	heatmapFeature.activeHeatmapEditors = newActiveHeatmapEditors

	log('activeHeatmapEditors', heatmapFeature.activeHeatmapEditors)
	logReturn()
}

