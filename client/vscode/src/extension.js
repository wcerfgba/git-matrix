import * as vscode from 'vscode'
import * as HeatmapFeature from './heatmap_feature'
import { log } from './utils'

export const activate = (context) => {
	const heatmapFeature = HeatmapFeature.create()
	HeatmapFeature.activate(heatmapFeature)
}