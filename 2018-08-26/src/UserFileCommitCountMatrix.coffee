class UserFileCommitCountMatrix
  ###::
  matrix: Array<[string, Array<[string, number]>]>
  files: Array<string>
  emails: Array<string>
  ###

  constructor: () ->
    # The matrix is a table with users along one axis and files along the other
    # axis, and the number of commits a user has for a file as the cell. We 
    # store the matrix internally as a 2-dimensional array of size 
    # `<num users> x <num files>`, and where each entry is a key-value pair.
    # The user entry is outermost and the file entry is innermost. The user 
    # entry is of the form `[ <email>, [ <file entry> ] ]`, and the 
    # file entry is of the form `[ <filename>, <user file commit count> ]`.
    # ```
    # [
    #   [ 'user1', [
    #     [ 'file1', 0 ],
    #     [ 'file2', 3 ]
    #     [ 'file3', 0]
    #   ]],
    #   [ 'user2', [
    #     [ 'file1', 12 ],
    #     [ 'file2',  0 ],
    #     [ 'file3',  3 ]
    #   ]],
    # ]
    # ```
    @matrix = []
    @files = []
    @emails = []
  
  addCommit: (commit) ->
    @emails = union @emails, [commit.email]
    @files = union @files, commit.files
    @reshapeMatrix()
    user = @matrix.find (u) => u[0] == commit.email
    throw new Error 'Matrix did not container user' if !user
    files = user[1]
    files.forEach (file) =>
      file[1] += 1 if commit.files.includes file[0]

  # Ensure that we have an entry in the matrix for every email in `@emails`,
  # and ensure that every user has an entry for every file in `@files`.
  reshapeMatrix: () ->
    currentEmails = @matrix.map (user) => user[0]
    newEmails = difference @emails, currentEmails
    newEmails.forEach (email) => 
      @matrix.push [ email, [] ]
    @matrix.forEach (user) =>
      files = user[1]
      currentFiles = files.map (file) => file[0]
      newFiles = difference @files, currentFiles
      newFiles.forEach (file) =>
        files.push [ file, 0 ]