# Todo
* Form for authentication -- paths to ssh keys and all that 

* Make so updates only render diif of files specifically, not all files at once to save on efficiency

* Allow watch for new commits ( need to modify my parsing of git diff? )

* Form for authentication -- paths to ssh keys and all that 
 
* Make so updates only render diif of files specifically, not all files at once to save on efficiency

* Centralize function calls, and render the react to just view, allowing redux to control via thunk

* Continue to reorganize the store and all corresponding functions (REFACTOR IT ALL)

8/19

* Aggregating data --view, do not change. Push only to clients, but to remain unchanged.  -- biderctional.
    * Permissions and authorize users
        * Results -- requires a more advanced server, try gitlab?
* white list I want these files to go out/ not go out white/blacklist 
    * limit files by size
        * RESULTS: Can blacklist and whitelist via GITIGNORE -- we can chose to blacklist everything and let some things through -- or vice versa. Becomes annoying, good convention is blacklist ONLY what is unnecessary, whether that be paths or otherwise
* Check privlidge needed on PC with GIT -- set up and access (transfer data ) /operate (and manage users) (manually/handle keys)


8/26 

* cvss vulnerabilities ** Guide -- Read more in manual
    *
* Git options
    * Settings, apis wtv. 
    * Report of what is included in git (git diff, log?) how to see the report of file?
        * git ls-tree --full-tree -r --name-only HEAD

9/4 
* Migrate to nodegit and utilize main process to execute git actions -- loading hanging is unacceptable, may be due to being in the renderer process. warrants investigation