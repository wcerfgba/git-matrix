# 2018-09-02

TODO:
* bug: --output --only-log don't work!
* bug: `undefined` file row when running live
* write tests!
* why does `spawn` behave strangely?




# 2018-09-01

TODO:
* bug: --output --only-log don't work!
* bug: --input is broke


regarding breakage, `spike-2/node_modules/immutable/contrib/cursor/__tests__/Cursor.ts.skip` is only present when read from input. compare `git-matrix -o data/git-matrix.html` with `git-matrix -i data/git-matrix.log -o data/git-matrix-from-log.html`. i suspect we are not handling the spawn stream properly :(


# 2018-08-31

we can now read from a file and write to a file. algorithm looks like its working and the performance is there. need to add in the other algorithms (commit count, percentage change), and maybe add 'cooling'.

also, coloring the table. then maybe grouping files/emails.

then, tests.

need to look for those git pair programming plugins sam was on about.


# 2018-08-27

we have html output. need to tidy up and make it so i can load gitlog dumps.
also i wanna exeriment with percentage change at some point (easier to 
color, more semantic).


# 2018-08-26

todo:
render to html table
sort by filename
add colouring to table
tests
group files and users



# 2018-08-22

pull list of commits from git!