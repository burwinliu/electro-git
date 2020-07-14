# electro-git
A GIT GUI interface based in Electron

# Todo
Figure out a way to move away from remote (potential issues?) -- When the time comes. As of right now, a decent work around is via remote.require() to get nodegit packages  

Add fs.watch support for linux (only on mac and windows right now as we use fs.watch recursive options)

Make so updates only render diif of files specifically, not all files at once to save on efficiency