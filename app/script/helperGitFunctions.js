const git =  require('electron').remote.require('nodegit');
const { getUserName, getUserEmail } = require('../store/userStore')

const renderStatusLi = (statusFile) => {
    newLi = document.createElement('li');
    newLi.innerHTML = '<input type="checkbox" id="'+ renderId(statusFile.path()) +'_checked" checked="checked" class="side-check">'+statusFile.path();
    newLi.id = renderId(statusFile.path())
    newLi.classList.add("landing-space");
    newLi.classList.add("side-click");
    
    if (statusFile.inIndex()){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right new">arrow_forward</i>`
    }
    else if (statusFile.isNew()){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right new">new_releases</i>`
    }
    else if (statusFile.isModified()){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right modify">autorenew</i>`
    }
    else if (statusFile.isRenamed()) { 
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right modify">assignment</i>`
    }
    else if (statusFile.isIgnored()) { 
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right modify">visibility_off</i>`
    }
    else if (statusFile.isDeleted()){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right modify">clear</i>`
    }
    return newLi;
}

const renderDiffBody = (item, fileId, info) => {
    for(let x in info){
        newLi = document.createElement('li');
        newPre = document.createElement('pre')
        newCode = document.createElement('code')
        newSpan = document.createElement('span')
        newPre.classList.add("pre-wrap")

        newSpan.classList.add("break-text")

        newSpan.textContent  = info[x];
        newLi.id = fileId + x
        newLi.appendChild(newSpan)
        newCode.appendChild(newLi)
        newPre.appendChild(newCode)
        item.appendChild(newPre)
    }
    
}

const renderId = (file) => {
    file = file.replace(/\W/g, '_');
    return file
}

const renderGitDiffInfo = async (repo) => {
    let result = {};
    let diffOpt = {
        flags: git.Diff.OPTION.SHOW_UNTRACKED_CONTENT | git.Diff.OPTION.RECURSE_UNTRACKED_DIRS
    };
    await git.Diff.indexToWorkdir(repo, null, diffOpt).then((diff) => {
        return diff.toBuf(1);
    }).then((temp)=>{
        let splitDiff = temp.split("\n");
        
        let headerReg = /diff --git a\/([^ ]*) b\/([^ ]*)/g

        p = -1
        storeNames = [null, null]
        for(let x in splitDiff){
            let match = headerReg.exec(splitDiff[x])
            if(match && p == -1){
                p = x;
                storeNames[0] = match[1];
            }
            else if(match && p != -1){
                result[storeNames[0]] = splitDiff.slice(p, x)
                storeNames[0] = match[1]
                p = x
            }
            
        }
        result[storeNames[0]] = splitDiff.slice(p, splitDiff.length)
    })
    return result;
}

const renderAuthor = () => {
    let result = git.Signature.now(getUserName(), getUserEmail());
    return result
}

const getStagedChanges = async (repo) => {
    const diff = await git.Diff.indexToWorkdir(repo, null, {
        flags: git.Diff.OPTION.INCLUDE_UNTRACKED |
               git.Diff.OPTION.RECURSE_UNTRACKED_DIRS
        });
    await diff.patches().then((patches) => {
        for(let temp in patches){
            patches[temp].hunks().then((hunk) =>{
                hunk.lines().then((inpt)=>console.log(inpt))
            })
            console.log(patches[temp].isAdded())
            console.log(patches[temp].isConflicted())
            console.log(patches[temp].isCopied())
            console.log(patches[temp].isDeleted())
            console.log(patches[temp].isIgnored())
            console.log(patches[temp].isModified())
            console.log(patches[temp].isRenamed())
            console.log(patches[temp].isTypeChange())
            console.log(patches[temp].isUnmodified())
            console.log(patches[temp].isUnreadable())
            console.log(patches[temp].isUntracked())
            console.log(patches[temp].lineStats())
            console.log(patches[temp].newFile())
            console.log(patches[temp].oldFile())
            console.log(patches[temp].size())
            console.log(patches[temp].status())
        }
    })
}

const helperGitAddCommit = async (fileNames, repo) => {
    let index = await repo.refreshIndex()
    for( let x in fileNames){
        if(fs.existsSync(fileNames[x])){
            index.addByPath(fileNames[x]);
        }
        
    }
    index.write();
    let oid = await index.writeTree();
    let head = await git.Reference.nameToId(repo, "HEAD");
    let parent = await repo.getCommit(head);
    repo.createCommit("HEAD", renderAuthor(), renderAuthor(), "message", oid, [parent])
}


exports.renderStatusLi = renderStatusLi;
exports.renderDiffBody = renderDiffBody;

exports.renderGitDiffInfo = renderGitDiffInfo;
exports.renderId = renderId;

exports.helperGitAddCommit = helperGitAddCommit;