// @flow

type Commit = {
  time: number,
  email: CommitEmail,
  files: Array<CommitFile>
}

type CommitFile = {
  name: FileName,
  linesAdded: number,
  linesDeleted: number,
  // TODO: dirstat changes/lines ???
}

type CommitEmail = string
type FileName = string