# electro-git
A GIT GUI interface based in Electron



# Todo
Allow watch for new commits ( need to modify my parsing of git diff? )

Form for authentication -- paths to ssh keys and all that 

Figure out a way to move away from remote (potential issues?) -- When the time comes. As of right now, a decent work around is via remote.require() to get nodegit packages  

Add fs.watch support for linux (only on mac and windows right now as we use fs.watch recursive options)

Make so updates only render diif of files specifically, not all files at once to save on efficiency

# Notes
git commit and push

define configurations --take snapshot names (tag a group of files) anbd be able to retrieve files that are broken
create snap shots, difference between snapshot, see file and see difference between files
Difference between files -- qs structure of file? 
See meta data about check in times and different between files (compare 2 files history

# Dependencies

Used this boiler plate to set up the application: https://github.com/electron-react-boilerplate

