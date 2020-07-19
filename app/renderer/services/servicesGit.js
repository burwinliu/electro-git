// ~/app/script/helperGitFunctions.js

// Imports

// State Storage
// import { 
//     getUserName,
//     getUserEmail, 
//     getRemoteUrl, 
//     getRemoteName, 
//     getBranchName, 
//     setRemoteUrl, 
//     setRemoteName 
// } from 

// For git functionality
import 'fs'
import { simpleGit } from 'simple-git'

// Render functions: Render information into HTML DOM objects for input

const renderGitStatusMenuItem = (statusFile) => {
    /*
    @param statusFile [type: object]
        Structure = {
            path: str   // path to file
            working_dir: char // the current directory's status, char corresponding to the official git status notation (see https://git-scm.com/docs/git-status,
                about half way down as of 2020)
            index: char // the index's status (or branch maybe?) that has been commited
        }
    @return [type: string]: a DOM element (li), containing the path from the file object, an icon corresponding to the status of the git status result

    Will render out a statusFile into a clickable menu item for a sidebar (or anything, but see the possible classes -- can customize according to whatever the notation is)
    */
    let newLi = document.createElement('li');
    newLi.innerHTML = '<input type="checkbox" id="'+ renderId(statusFile.path) +'_checked" checked="checked" class="side-check">'+statusFile.path;
    newLi.id = renderId(statusFile.path)
    newLi.classList.add("landing-space");
    newLi.classList.add("side-click");
    if (statusFile.working_dir == '?'){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right new" title="Not Tracked">sync_disabled</i>`
    }
    else if (statusFile.working_dir == '!'){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right ignored" title="Ignored">remove</i>`
    }
    else if (statusFile.working_dir == 'M'){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right modified" title="Modified">sync</i>`
    }
    else if (statusFile.working_dir == 'A'){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right added" title="Added">add</i>` 
    }
    else if (statusFile.working_dir == 'D'){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right deleted" title="Deleted">delete</i>` 
    }
    else if (statusFile.working_dir == 'R') { 
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right renamed" title="Renamed">assignment_return</i>` 
    }
    else if (statusFile.working_dir == 'C') { 
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right copied" title="Copied">content_copy</i>` 
    }
    else if (statusFile.working_dir == 'U'){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right updated-unmerged" title="Updated but unmerged">merge_type</i>`
    }
    return newLi;
}

const renderGitDiffBody = (fileId, info) => {
    console.log(fileId, info);

    let result = document.createElement('div');

    let header = document.createElement('div');

    header.classList.add()
    for(let x in info.chunks){
        console.log(info.chunks[x])

        newLi = document.createElement('li');
        newPre = document.createElement('pre')
        newCode = document.createElement('code')
        newSpan = document.createElement('span')

        newPre.classList.add("landing-space")

        newSpan.classList.add("break-text")

        newSpan.textContent  = info.chunks[x];
        newLi.id = fileId + x
        newLi.appendChild(newSpan)
        newCode.appendChild(newLi)
        newPre.appendChild(newCode)
        result.appendChild(newPre)
    }

    return result
}

const renderId = (file) => {
    file = file.replace(/\W/g, '_');
    return file
}

const renderGitDiffInfo = (text) => {
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
    isHeader = false
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
            headerInfo = {
                fromLine: chunkHeader[1],
                fromLineLength: chunkHeader[2],
                toLine: chunkHeader[3],
                toLineLength: chunkHeader[4],
            }
            chunk.head = headerInfo
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

const renderAuthor = () => {
    // TODO update
    let result = git.Signature.now(getUserName(), getUserEmail());
    return result
}

//Helper Functions: Perform actions given information to furfill a request
const helperGitInit = async (path) => {
    let resultingRepo = await simpleGit(path).init()
    return resultingRepo;
}

const helperGitOpen = (path) => {
    return simpleGit(path);
}

const helperGitAddCommit = async (repo, fileNames, msg) => {
    let index = await repo.refreshIndex()
    for( let x in fileNames){
        // todo transition to files and directories seperated
        if(fs.existsSync(fileNames[x])){
            await index.addByPath(fileNames[x]);
        }
        else{
            await index.removeByPath(fileNames[x]);
        }
        
    }
    await index.write();
    let oid = await index.writeTree();
    let head = await git.Reference.nameToId(repo, "HEAD");
    let parent = await repo.getCommit(head);
    await repo.createCommit("HEAD", renderAuthor(), renderAuthor(), msg, oid, [parent])
}

const helperGitPush = async (repo, remote, branch) => {
    await repo.push(remote, branch)
}

const helperGitDiff = async (repo, hashA, hashB) => {
    let options;
    if(hashA && hashB){
        options = [
            hashA,
            hashB
        ]
        return repo.diff(options)
    }
    return repo.diff()
}

const helperGitStatus = async (repo, fileName) => {
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

const helperGitBranch = async (repo) => {
    return await repo.branch();
}

const helperGitClone = async (repoURL, localPath) => {
    return await simpleGit.clone(repoURL, localPath)
}




// Exports
exports.renderGitDiffBody = renderGitDiffBody;
exports.renderGitStatusMenuItem = renderGitStatusMenuItem;

exports.renderGitDiffInfo = renderGitDiffInfo;
exports.renderId = renderId;


exports.helperGitInit = helperGitInit
exports.helperGitOpen = helperGitOpen

exports.helperGitDiff = helperGitDiff;
exports.helperGitStatus = helperGitStatus

exports.helperGitAddCommit = helperGitAddCommit;
exports.helperGitPush = helperGitPush;

exports.helperGitBranch = helperGitBranch
exports.helperGitClone = helperGitClone;

