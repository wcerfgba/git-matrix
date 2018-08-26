import 'babel-polyfill'

import * as vscode from 'vscode'
import * as HeatmapFeature from './heatmap_feature'
import * as logging from '../vendor/eyeson-common/lib/logging'

logging.filterLogs(logLine => {
	return [
		/^HeatmapEditor/
	].reduce((keep, want) => keep && want.test(logLine[0]))
})

export const activate = async (extensionContext) => {
	const heatmapFeature = HeatmapFeature.create({
		extensionContext: extensionContext
	})
	await HeatmapFeature.activate(heatmapFeature)
}