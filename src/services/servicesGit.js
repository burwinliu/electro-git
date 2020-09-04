// ~/app/script/helperGitFunctions.js

// Imports
// For git functionality
import 'fs'
import simpleGit, { GitError } from 'simple-git';


// Render functions: Render information into better, understandable information to be loaded
export const renderGitChunkTwoFileFormat = (chunk) => {
    /*
    @param chunk [type Object] -> Chunk that has been loaded by method renderGitDiffInfo (see below) which represents a single git chunk
        structure = {
            header: { ->  '@@ -frontLine,frontLineLength +toLine,toLineLength @@' parsed
                fromLine: int,
                fromLineLength: int,
                toLine: int,
                toLineLength: int,
            },
            text: [{
                type: string,
                body: string
            }, ... ], -> body of each chunk
        }
    @return [type [object]]
        structure = [{
            aSign: string,
            aNumber: Number,
            aText: string,
            bSign: string,
            bNumber: Number,
            bText: string
        }]

    Renders a git chunk into a two file format (side by side comparison) by aligning whitespace, and placing text in between, aligned to the top:

        Add "-" to positionA, increment; add "+" to file B, increment; until " " is encountered, then align both pointers and place whitespace object. Repeat.
    */
    let chunkText = chunk.text
    let pFrom = Number(chunk.header.fromLine)
    let pTo = Number(chunk.header.toLine)

    let pA = 0
    let pB = 0

    const res = []

    for (const i in chunkText){
        if(chunkText[i].type === "-"){
            if(pA >= res.length){
                res.push({
                    aSign: "-",
                    aNumber: pFrom,
                    aText: chunkText[i].body,
                    bSign: "",
                    bNumber: null,
                    bText: ""
                })
            }
            else{
                res[pA].aNumber = pFrom
                res[pA].aText = chunkText[i].body
                res[pA].aSign = "-"
            }
            pA += 1
            pFrom += 1
        }
        else if(chunkText[i].type === "+"){
            if(pB >= res.length){
                res.push({
                    aSign: "",
                    aNumber: null,
                    aText: "",
                    bSign: "+",
                    bNumber: pTo,
                    bText: chunkText[i].body
                })
            }
            else{
                res[pB].bNumber = pTo
                res[pB].bText = chunkText[i].body
                res[pB].bSign = "+"
            }
            pB += 1
            pTo += 1
        }
        else if(chunkText[i].type === "\\"){
            continue
        }
        else{
            res.push({
                aSign: " ",
                aNumber: pFrom,
                aText: chunkText[i].body,
                aSign: " ",
                bNumber: pTo,
                bText: chunkText[i].body
            })
            
            pA = res.length
            pB = pA

            pTo += 1
            pFrom += 1
        }
    }
    return res
}

export const renderGitChunkCompressed = (chunk) => {
    /*
    @param chunk [type Object] -> Chunk that has been loaded by method renderGitDiffInfo (see below) which represents a single git chunk
        structure = {
            header: { ->  '@@ -frontLine,frontLineLength +toLine,toLineLength @@' parsed
                fromLine: int,
                fromLineLength: int,
                toLine: int,
                toLineLength: int,
            },
            text: [{
                type: string,
                body: string
            }, ... ], -> body of each chunk
        }
    @return [type [object]]
        structure = [{
            aSign: string,
            aNumber: Number,
            bSign: string,
            bNumber: Number,
            text: string
        }]

    Renders a git chunk into a one file format (compressed) by adding into the 

    */
   let chunkText = chunk.text
    let pFrom = Number(chunk.header.fromLine)
    let pTo = Number(chunk.header.toLine)

    const res = []

    for (const i in chunkText){
        if(chunkText[i].type === "-"){
            res.push({
                aSign: "-",
                aNumber: pFrom,
                bSign: "",
                bNumber: null,
                text: chunkText[i].body,
            })
            pFrom += 1
        }
        else if(chunkText[i].type === "+"){
            res.push({
                aSign: "",
                aNumber: null,
                bSign: "+",
                bNumber: pTo,
                text: chunkText[i].body
            })
            pTo += 1
        }
        else if(chunkText[i].type === "\\"){
            continue
        }
        else{
            res.push({
                aSign: " ",
                aNumber: pFrom,
                aSign: " ",
                bNumber: pTo,
                text: chunkText[i].body
            })
            pTo += 1
            pFrom += 1
        }
    }
    return res
}

export const renderGitDiffInfo = (text) => {
    /* 
        @param text [type string]
        @return [type object]
            Structure = {
                fileToName: {
                        fileA: pathFileFrom,
                        fileB: pathFileTo,
                        meta: [string, ... ], -> Lines of meta data that initially occur in git diff header
                        chunks: [{
                            header: { ->  '@@ -frontLine,frontLineLength +toLine,toLineLength @@' parsed
                                fromLine: int,
                                fromLineLength: int,
                                toLine: int,
                                toLineLength: int,
                            },
                            text: [{
                                type: string,
                                body: string
                            }, ... ], -> body of each chunk
                        }],
                }, ...
            }

        Given a plain wall text of git diff, render it out into a data structure for parsing later
    */
    let result = {};
    let splitDiff = text.split("\n");
    
    let headerReg = /diff --git a\/(.*) b\/(.*)/
    let chunkHead = /\@\@ \-([0-9]*)\,?([0-9]*)? \+([0-9]*)\,?([0-9]*)? \@\@([ +\-\\])?(.*)?/
    let chunkLine = /([ +\-\\])(.*)/

    let p = 0
    while(p < splitDiff.length && headerReg.exec(splitDiff[p])){
        let current = {
            fileA: null,
            fileB: null,
            meta: [],
            chunks: [],
        }        
        let header = headerReg.exec(splitDiff[p])

        current.fileA = header[1]
        current.fileB = header[2]
        p++

        // Set up the header and record the information
        while(p < splitDiff.length && !chunkHead.exec(splitDiff[p]) && !headerReg.exec(splitDiff[p])){
            current.meta.push(splitDiff[p])
            p++
        }
        while(p < splitDiff.length && chunkHead.exec(splitDiff[p]) && !headerReg.exec(splitDiff[p])){
            let chunk = {
                header: {
                    fromLine: -1,
                    fromLineLength: -1,
                    toLine: -1,
                    toLineLength: -1,
                    functionContext: "",
                },
                text: [],
            }
            
            let chunkHeader = chunkHead.exec(splitDiff[p])
            let headerInfo = {
                fromLine: chunkHeader[1],
                fromLineLength: chunkHeader[2],
                toLine: chunkHeader[3],
                toLineLength: chunkHeader[4],
                functionContext: ""
            }
            if(chunkHeader[2] === undefined){
                headerInfo.fromLineLength = 1
            }
            if(chunkHeader[4] === undefined){
                headerInfo.toLineLength = 1
            }
            if(chunkHeader[5]!== undefined && chunkHeader[6] !== undefined){
                headerInfo.functionContext = chunkHeader[6]
            }
            chunk.header = headerInfo
            p++ 
            while(p < splitDiff.length && chunkLine.exec(splitDiff[p]) && !headerReg.exec(splitDiff[p]) && !chunkHead.exec(splitDiff[p])){
                let newChunkLine = chunkLine.exec(splitDiff[p])
                let chunkLineInput = {
                    type: newChunkLine[1],
                    body: newChunkLine[2],
                }
                chunk.text.push(chunkLineInput)
                p++
            } 
            current.chunks.push(chunk)
        }
        result[current.fileB] = current
    }
    return result;
}

export const renderGitStatusHist = (text) => {
    const regexStatus = /([MADRC])[\W]([^\n]*)/
    const splitDiff = text.split("\n");
    const result = {}

    for(let line in splitDiff){
        let newItem = {}
        const renderedLine = regexStatus.exec(splitDiff[line])
        if(renderedLine){
            newItem.working_dir = ""
            newItem.index = renderedLine[1]
            result[renderedLine[2]] = newItem
    
        }
    }
    return result
}

export const renderGitEnvSshCmd = (sshPath) => {
    return "ssh -i" + sshPath + "-o IdentitiesOnly=yes";
}



//Helper Functions: Perform actions given information to furfill a request


export const helperGitOpen = (path) => {
    return simpleGit(path);
}

export const helperGitInit = async (path) => {
    let resultingRepo = await simpleGit(path).init()
    return resultingRepo;
}

export const helperGitClone = async (localPath, repoURL) => {
    return await simpleGit().clone(repoURL, localPath)
}

export const helperGitCheckIgnore = (repoPath, filePath) => {
    const repo = helperGitOpen(repoPath)
    return repo.checkIgnore(filePath)
}

export const helperGitDir = (repoPath) => {
    const repo = helperGitOpen(repoPath)
    return repo.revparse(['--git-dir'])
}

export const helperGitConfig = (path, name, email) => {
    const repo = helperGitOpen(path)
    const commandName = ['config', 'user.name', name]
    const configMail = [ 'config', 'user.email', email]
    repo.raw(commandName, (err) => {
        console.log(err)
    })
    repo.raw(configMail, (err) => {
        console.log(err)
    })
}

export const helperGitFetch = async (path) => {
    const repo = helperGitOpen(path)
    await repo.fetch()
    return repo.status()
}

export const helperGitPull = async (path) => {
    const repo = helperGitOpen(path)
    return await repo.pull()

}

export const helperGitAdd = async (path, fileNames) => {
    const repo = helperGitOpen(path)
    repo.add(fileNames)
}

export const helperGitAddCommit = async (path, fileNames, msg) => {
    const repo = helperGitOpen(path)
    await repo.add(fileNames)
    await repo.commit(msg, fileNames)
}

export const helperGitTag = async (path, tagTitle, msg) => {
    const repo = helperGitOpen(path)
    repo.addAnnotatedTag(tagTitle, msg)
}

export const helperGitPush = (path) => {
    const repo = helperGitOpen(path)
    return repo.push()
}

export const helperGitPushTag = (path) => {
    const repo = helperGitOpen(path)
    return repo.pushTags()
}

export const helperGitDiff = async (path) => {
    /*
        @return [type string]

        returns string of git diff return object
    */
    let diff;
    const repo = helperGitOpen(path)

    try{
        diff = await repo.diff(["HEAD"])
    }
    catch(err){
        diff = await repo.diff(["--cached"])
    }
    return diff
}

export const helperGitDiffHist = async (path, input) => {
    const repo = helperGitOpen(path)
    const pastHash = input + "^"
    const hash = "" + input + ""
    let result;
    try{
        result = await repo.diff([pastHash, hash])    
    }
    catch(err){
        result = await repo.diff(["4b825dc642cb6eb9a060e54bf8d69288fbee4904", hash]) // COMPARE TO HEAD OF TREE AS HEAD 
                                                                                        // OF TREE IS 4b825dc642cb6eb9a060e54bf8d69288fbee4904 (constantly) IN GIT
    }
    return result
}

export const helperGitStatus = async (path, fileName) => {
    /*  @param path [string]
        @param fileName [[Optional] type string]: A relative file path to have its status returned
        @return [type [FileStatusSummary] object]
            Structure [{
                path: str,
                index: str,
                working_dir: str,
            }]

        Return the files that have been changed since the last commit and their corresponding status in a 
    */
    let files  
    const repo = helperGitOpen(path)

    if(fileName){
        files = await repo.status([fileName])
    }
    else{
        files = await repo.status();
    }
    return files
}

export const helperGitShowHist = async(path, commitCode) => {
    let files  
    const repo = helperGitOpen(path)

    return await repo.show(["--name-status", commitCode])
}

export const helperGitLog = (path) => {
    const repo = helperGitOpen(path)
    return repo.log(["--decorate"])
}

export const helperGitLogFile = (repoPath, filePath) => {
    const repo = helperGitOpen(repoPath)
    return repo.log(["--decorate", "--", filePath])
}

export const helperGitRemoteName = (path) => {
    const repo = helperGitOpen(path)
    return repo.listRemote(['--get-url'])
}

export const helperGitSetRemoteUrl = async (path, url) => {
    const repo = helperGitOpen(path)
    repo.remote(['set-url', 'origin', url]).catch((err) => {
        if (err instanceof GitError) {
            repo.remote(['add', 'origin', url])
            repo.push(['-u', 'origin', 'master'])
        }
    })
}

export const helperGitBranch = async (path) => {
    const repo = helperGitOpen(path)
    return await repo.branch();
}

export const helperGitBranchList = async (path) => {
    const repo = helperGitOpen(path)
    const branch = await repo.branch()
    return branch
}

export const helperGitBranchCheckout = async (path, branchName) => {
    const repo = helperGitOpen(path)
    return await repo.checkout(branchName)
}

export const helperGitBranchCreate = async (path, branchName) => {
    const repo = helperGitOpen(path)
    const result = await repo.checkout(["-b", branchName])
    console.log("DONT BRANCHING")
    return result
}

export const helperGitBranchPush = async (path, branchName) => {
    const repo = helperGitOpen(path)
    return await repo.push(['--set-upstream', 'origin', branchName])
}

export const helperGitCheckBranchRemote = async (path, branchName) => {
    /*
        Check if a branch exists remotely, if so we make it the upstream
    */
    const repo = helperGitOpen(path)
    const matched = await repo.raw(['ls-remote', '--heads', 'origin', branchName])
    if(matched.length !== 0) {
        repo.raw(['branch', '--set-upstream-to', 'origin' + branchName])
    }

    return (matched.length !== 0)
}

export const helperGitIsMerge = async (pathName) => {
    const repo = helperGitOpen(pathName)
    return (await repo.raw(['rev-list', '-1', 'MERGE_HEAD'])).length !== 0
}

export const helperGitMergePull = async (pathName) => {
    const repo = helperGitOpen(pathName)
    return await repo.commit("Merging Conflicted Merge")
}
