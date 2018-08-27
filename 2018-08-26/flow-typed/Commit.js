declare type Commit = {
  time: number,
  email: string,
  files: Array<{
    name: string,
    added: number,
    deleted: number
  }>
}