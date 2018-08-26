import 'babel-polyfill'
import 'isomorphic-fetch'
import * as vscode from 'vscode'
import { default as logging } from 'log4js'



// Environment

const auth = { id: '2ea0bda3-809f-41da-acbb-e3f4d2e109f3', secret: 'yagetme' }

const session = "2ea0bda3-0000-41da-bbbb-e3f4d2e109f3" // TODO: uuid

logging.configure({
  appenders: { out: { type: 'console', layout: { type: 'basic' } } },
  categories: { default: { appenders: ['out'], level: 'debug' } }
})

const logger = logging.getLogger()



// Entry

export const activate = (extensionContext) => {
	bindEventListeners(extensionContext)
}



// Event listeners

const eventListeners = {}

const bindEventListeners = (extensionContext) => {
	logger.info('bindEventListeners')
	const events = [
		{ bind: vscode.workspace.onDidOpenTextDocument,
		  handle: onDidOpenTextDocument,
			name: 'onDidOpenTextDocument' },
		{ bind: vscode.workspace.onDidCloseTextDocument,
		  handle: onDidCloseTextDocument,
			name: 'onDidCloseTextDocument' },
		{ bind: vscode.window.onDidChangeVisibleTextEditors,
		  handle: onDidChangeVisibleTextEditors,
			name: 'onDidChangeVisibleTextEditors' },
		{ bind: vscode.window.onDidChangeTextEditorSelection,
		  handle: onDidChangeTextEditorSelection,
			name: 'onDidChangeTextEditorSelection' },
		{ bind: vscode.window.onDidChangeActiveTextEditor,
		  handle: onDidChangeActiveTextEditor,
			name:'onDidChangeActiveTextEditor'  }
	]

	for (let event of events) {
		if (undefined === eventListeners[event]) {
			eventListeners[event.name] = event.bind(event.handle)
		}
	}

	logger.debug('eventListeners = %j', eventListeners)
}

const onDidOpenTextDocument = (textDocument) => {
	logger.info('onDidOpenTextDocument')
	pushEvent({
		event_type: 'file-open-start',
		snapshot: snap(textDocument),
		time: timestamp()
	})
}

const onDidCloseTextDocument = (textDocument) => {
	logger.info('onDidCloseTextDocument')
	pushEvent({
		event_type: 'file-open-end',
		snapshot: snap(textDocument),
		time: timestamp()
	})
}

const onDidChangeVisibleTextEditors = () => {
	logger.info('onDidChangeVisibleTextEditors')

}

const onDidChangeTextEditorSelection = () => {
	logger.info('onDidChangeTextEditorSelection')

}

const onDidChangeActiveTextEditor = () => {
	logger.info('onDidChangeActiveTextEditor')

}



// Event cache

let events = []

const pushEvent = (e) => events.push(e)



// Snapshot cache

let snapshots = []

const snap = (textDocument) => {
	logger.info('snap')

	const snapshot = {
		project_name: 'todo', 
		file_path: 'todo',
		time: timestamp(),
		snapshot: textDocument.getText()
	}

	logger.debug('snapshot = %j', snapshot)

	const latest = snapshots.reduce((latest, next) => {
		if (next.file_path === snapshot.file_path) {
			if (latest === null || orderByTime(next, latest) > 0) {
				return next
			}
		}
		
		return latest
	}, null)

	if (null === latest || latest.snapshot !== snapshot.snapshot) {
		snapshots.push(snapshot)
	}

	logger.debug('snapshots = %j', snapshots)

	return snapshots.length - 1
}

const pruneSnapshots = () => {
	logger.info('pruneSnapshots')

	const pruned = []

	for (let next of snapshots) {
		const latestIndex = pruned.findIndex(snap => snap.file_path = next.file_path)
		const latest = pruned[latestIndex]
		if (latest !== undefined && orderByTime(next, latest) > 0) {
			pruned.splice(latestIndex, 1, next)
		}
	}

	logger.info('pruned = %j', pruned)

	snapshots = pruned
}



// Transmission

const postEvents = () => {
	if (!shouldPostEvents()) {
		return
	}
	fetch(postEventsEndpoint, {
		body: postEventsBody(),
		headers: {
      'content-type': 'application/json'
    },
		method: 'POST'
	})
		.then(res => {
			// TODO: clear cache properly
		})
		.catch(err => {
			logger.error(err)
		})
	events = []
	pruneSnapshots()
}

const shouldPostEvents = () => {
	return events.length > 0
}

const postEventsInterval = setInterval(postEvents, 10 * 1000)

const postEventsEndpoint = 'http://localhost:3000/events'

const postEventsBody = () => {
	return JSON.stringify({
		auth,
		session,
		snapshots,
		events
	})
}



// Util

const timestamp = () => (new Date()).toISOString()

const orderByTime = (a, b) => a.time.localeCompare(b.time)