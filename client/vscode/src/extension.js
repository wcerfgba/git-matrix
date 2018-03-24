import * as vscode from 'vscode'
import * as HeatmapFeature from './heatmap_feature'

export const activate = (extensionContext) => {
	const heatmapFeature = HeatmapFeature.create({
		extensionContext: extensionContext
	})
	HeatmapFeature.activate(heatmapFeature)
}