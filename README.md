# electro-git
A GIT GUI interface based in Electron

# Pallete
Background: #f0f2ff
Primary: #3f51b5


# Todo
disassociate githelper objects with programming, make serviceGit full interface for EVERYTHING, wrapping it all in (provide paths, not objects, to execute)

Design better color scheme, background (gradiant with focus on the middle -- lighting or something on those lines), expand to more space and responsive to size of window. Finally, use more colors 

Form for authentication -- paths to ssh keys and all that 

Make so updates only render diif of files specifically, not all files at once to save on efficiency

# Notes
TODO :authentication for clone, set up of repo etc.

setup diffefrent tables in body depending on status (undefined file, nothing to render, etc.)

Have a rerender timing (so spamming wont cause sudden hiccups) -- implement isloading sequnce and black out table until *loading is finished*. Implement reload inside the body as well!


define configurations --take snapshot names (tag a group of files) anbd be able to retrieve files that are broken
create snap shots, difference between snapshot, see file and see difference between files
Difference between files -- qs structure of file? 
See meta data about check in times and different between files (compare 2 files history

# Dependencies

Used this boiler plate to set up the application: https://github.com/alexdevero/electron-react-webpack-boilerplate

