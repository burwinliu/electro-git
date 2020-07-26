// ~/app/script/helperGitFunctions.js

// Imports
// For git functionality
import 'fs'
import simpleGit from 'simple-git';

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
    
    let headerReg = /diff --git a\/([^ ]*) b\/([^ ]*)/
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

export const renderGitEnvSshCmd = (sshPath) => {
    return "ssh -i" + sshPath + "-o IdentitiesOnly=yes";
}



//Helper Functions: Perform actions given information to furfill a request
export const helperGitInit = async (path) => {
    let resultingRepo = await simpleGit(path).init()
    return resultingRepo;
}

export const helperGitOpen = (path) => {
    return simpleGit(path);
}

export const helperGitConfig = (repo, name, email) => {
    const commandName = ['config', 'user.name', name]
    const configMail = [ 'config', 'user.email', email]
    repo.raw(commandName, (err) => {
        console.log(err)
    })
    repo.raw(configMail, (err) => {
        console.log(err)
    })
}

export const helperGitAdd = async (repo, fileNames) => {
    repo.add(fileNames)
}

export const helperGitAddCommit = async (repo, fileNames, msg) => {
    await repo.add(fileNames)
    await repo.commit(msg, fileNames)
}

export const helperGitPush = (path) => {
    const repo = helperGitOpen(path)
    return repo.push()
}

export const helperGitDiff = async (repo, hashA, hashB) => {
    /*
        @return [type string]

        returns string of git diff return object
    */
    let options;
    let diff;
    if(hashA && hashB){
        options = [
            hashA,
            hashB
        ]
        return repo.diff(options)
    }
    try{
        diff = await repo.diff(["HEAD"])
    }
    catch(err){
        diff = await repo.diff(["--cached"])
    }
    return diff
}

export const helperGitStatus = async (repo, fileName) => {
    /*  @param repo [type simpleGit object]
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
    if(fileName){
        files = await repo.status([fileName])
    }
    else{
        files = await repo.status();
    }
    return files.files
}

export const helperGitBranch = async (repo) => {
    return await repo.branch();
}

export const helperGitClone = async (repoURL, localPath) => {
    return await simpleGit.clone(repoURL, localPath)
}
