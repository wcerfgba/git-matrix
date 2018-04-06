export const window = {
  visibleTextEditors: [],
  createTextEditorDecorationType: jest.fn(),
  onDidChangeVisibleTextEditors: jest.fn()
}

export const workspace = {
  onDidOpenTextDocument: jest.fn(),
  onDidCloseTextDocument: jest.fn()
}

export const OverviewRulerLane = {
  Left: 0
}