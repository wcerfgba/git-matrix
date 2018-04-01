export const create = (o = {}) => {
  return {
    projectName: o.projectName,
    vcsReference: o.vcsReference,
    filePath: o.filePath
  }
}