// A FileLine provides all the information necessary to target a particular 
// line of a file. 
export type FileLine = {

  // Arbitrary reference at each end (repo name)
  projectName : string,

  // Something usable by the project's configured VCS to determine a set of 
  // files. We may want to look at the diff with the next revision after 
  // this one when determining which lines have received effects.
  vcsReference : string,
  
  // Relative to project root.
  filePath : string,
  
  lineNumber : number
}