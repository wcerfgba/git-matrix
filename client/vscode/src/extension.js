import 'babel-polyfill'

import * as vscode from 'vscode'
import * as HeatmapFeature from './heatmap_feature'

export const activate = async (extensionContext) => {
	const heatmapFeature = HeatmapFeature.create({
		extensionContext: extensionContext
	})
	await HeatmapFeature.activate(heatmapFeature)
}