// ~/app/script/helperGitFunctions.js

// Imports
// For git functionality
import 'fs'
import simpleGit from 'simple-git';

// Render functions: Render information into HTML DOM objects for input
export const renderId = (file) => {
    file = file.replace(/\W/g, '_');
    return file
}

export const renderGitChunk = (chunk) => {
    // Add "-" to file A, "+" to file B until " " is encountered, then wait for the catch up. Repeat.
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
                    bSign: " ",
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
                    aSign: " ",
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
    let chunkHead = /\@\@ \-([0-9]*)\,([0-9]*) \+([0-9]*)\,([0-9]*) \@\@/
    let chunkLine = /([ +\-])(.*)/

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

        // Set up the header and record the information
        while(p < splitDiff.length && !chunkHead.exec(splitDiff[p])){
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
                },
                text: [],
            }
            
            let chunkHeader = chunkHead.exec(splitDiff[p])
            
            if (!chunkHeader){
                console.log(splitDiff[p])
            }
            let headerInfo = {
                fromLine: chunkHeader[1],
                fromLineLength: chunkHeader[2],
                toLine: chunkHeader[3],
                toLineLength: chunkHeader[4],
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

export const renderAuthor = () => {
    // TODO update
    let result = git.Signature.now(getUserName(), getUserEmail());
    return result
}

//Helper Functions: Perform actions given information to furfill a request
export const helperGitInit = async (path) => {
    let resultingRepo = await simpleGit(path).init()
    return resultingRepo;
}

export const helperGitOpen = (path) => {
    return simpleGit(path);
}

export const helperGitAddCommit = async (repo, fileNames, msg) => {
    await repo.add(fileNames)
    await repo.commit(msg, fileNames)
}

export const helperGitPush = async (repo) => {
    await repo.push()
}

export const helperGitDiff = async (repo, hashA, hashB) => {
    /*
        @return [type string]

        returns string of git diff return object
    */
    let options;
    if(hashA && hashB){
        options = [
            hashA,
            hashB
        ]
        return repo.diff(options)
    }
    else if(hashA){
        return
    }
    return repo.diff()
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