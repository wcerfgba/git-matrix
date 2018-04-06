import * as HeatmapFeature from '../src/heatmap_feature'
import * as HeatmapHandler from '../src/heatmap_handler'
import * as vscode from 'vscode'
import { Map } from 'immutable'

import * as logging from '../vendor/eyeson-common/src/logging'

logging.filterLogs((logLine) => {
  return (
    /^Heatmap/.test(logLine[0])
  )
})

describe('HeatmapFeature', () => {
  let subject

  beforeEach(() => {
    subject = HeatmapFeature.create({
    })
  })

  describe('activate', () => {
    it('binds event handlers', async (done) => {
      await HeatmapFeature.activate(subject)
      expect(vscode.workspace.onDidOpenTextDocument.mock.calls.length).toEqual(1)
      expect(vscode.workspace.onDidCloseTextDocument.mock.calls.length).toEqual(1)
      expect(vscode.window.onDidChangeVisibleTextEditors.mock.calls.length).toEqual(1)
      done()
    })
  })
  
  describe('synchronize', () => {
    it('leaves an activated HeatmapHandler for each textDocument', () => {
      const documents = [
        { fileName: 'werwe' }
      ]
      vscode.workspace.textDocuments = documents

      HeatmapFeature.synchronize(subject)

      documents.forEach(doc => {
        const heatmapHandler = subject.heatmapHandlersByFilePath.get(doc.fileName)
        expect(HeatmapHandler.filePath(heatmapHandler)).toEqual(doc.fileName)
        expect(heatmapHandler.isActive).toBe(true)
      })
    })

    it('maintains handlers for open documents', () => {
      HeatmapHandler.deactivate = jest.fn()

      const documents = [
        { fileName: 'zsdvsd' }
      ]
      vscode.workspace.textDocuments = documents

      const handlers = Map([
        [ 'zsdvsd', HeatmapHandler.create({
          textDocument: documents[0]
        }) ]
      ])
      subject.heatmapHandlersByFilePath = handlers
      
      HeatmapFeature.synchronize(subject)

      expect(HeatmapHandler.deactivate.mock.calls.length).toEqual(0)
    })

    it('sets the textEditor for handlers of visible documents', () => {
      const documents = [
        { fileName: 'werwe' }
      ]
      vscode.workspace.textDocuments = documents

      const editors = documents.map(doc => ({ document: doc }))
      vscode.window.visibleTextEditors = editors

      HeatmapFeature.synchronize(subject)

      editors.forEach(editor => {
        const heatmapHandler = subject.heatmapHandlersByFilePath.get(editor.document.fileName)
        expect(heatmapHandler.textEditor).toEqual(editor)
      })
    })
  })
})