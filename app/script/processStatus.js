const git =  require('electron').remote.require('nodegit');

var path = require("path");

const renderStatusLi = (statusFile) => {
    newLi = document.createElement('li');
    newLi.innerHTML = '<input type="checkbox" checked="checked" class="side-check">'+statusFile.path();
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
    return newLi;
}

const renderDiffBody = (item, fileId, info) => {
    for(let x in info){
        newLi = document.createElement('li');
        newLi.classList.add("break-li")
        newLi.textContent  = info[x];
        newLi.id = fileId + x
        item.appendChild(newLi)
    }
    
}

const renderId = (file) => {
    file = file.replace(/\W/g, '_');
    return file
}

const renderGitDiffInfo = async (repo) => {
    let result = {};
    await git.Diff.indexToWorkdir(repo).then((diff) => {
        return diff.toBuf(1);
    }).then((temp)=>{
        let splitDiff = temp.split("\n");
        
        let headerReg = /diff --git a\/([^ ]*) b\/([^ ]*)/g

        p = -1
        storeNames = [null, null]
        for(let x in splitDiff){
            let match = headerReg.exec(splitDiff[x])
            if(match && p == -1){
                p = x
                storeNames[0] = match[1]
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

async function getStagedChanges(repo) {
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


exports.renderStatusLi = renderStatusLi;
exports.renderDiffBody = renderDiffBody;

exports.renderGitDiffInfo = renderGitDiffInfo;
exports.renderId = renderId;