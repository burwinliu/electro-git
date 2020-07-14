const{
    getRepoPath,
} = require('../store/repoStore')
const {
    setLandingAddFiles,
    getLandingFilePath,
    setLandingReset,
    getLanding,
    getLandingFileList,
    setLandingFile,
    getLandingFileDiff
} = require('../store/landingStore')
// const git = require('nodegit');
const{ renderStatusLi, renderGitDiffInfo, renderId, renderDiffBody} = require('../script/processStatus')

const git =  require('electron').remote.require('nodegit');
const customTitlebar = require('custom-electron-titlebar');
const fs = require('fs')

// items
let fsWait = false;
let idMap = {}

//functions
const initialize = async () =>{
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#444')
    });
    
    let itemHeader = document.getElementById("nav-currentrepo");
    

    let repo = await git.Repository.open(String(getRepoPath()));
    let branch = await repo.getCurrentBranch();
    itemHeader.innerHTML = "Branch: " + branch.shorthand() + ", Path: " + getLandingFilePath();

    renderGitInfo();
    renderCurrentDiff();
}

const onUpdate = async (event, file) => {
    if (fsWait) return;
    renderGitInfo();
    renderCurrentDiff();
    fsWait = setTimeout(() => {
        fsWait = false;
    }, 1000);
}

const renderGitInfo = async () => {
    let currentUl = document.getElementById("side-diff");
    let repo = await git.Repository.open(String(getRepoPath()));
    let gitInfo = await renderGitDiffInfo(repo)
    
    currentUl.innerHTML = '<li class="header"><input type="checkbox" checked="checked" class="side-check">Changed Files</li>'
    
    await repo.getStatus().then((arrayStatusFile) => {
        if( ! getLandingFileList().hasOwnProperty(getLandingFilePath())){
            setLandingFile(Object.keys(getLandingFileList)[0])
        }
        
        for(let i = 0; i<arrayStatusFile.length; ++i){
            let item = arrayStatusFile[i]
            let liNode = renderStatusLi(item)

            idMap[liNode.id] = item.path();
            liNode.setAttribute("onclick","changeMain(event)");
            currentUl.appendChild(liNode);
        }
    })
    for (let key in gitInfo) {
        setLandingAddFiles(key, gitInfo[key])
    }

    
}

const renderCurrentDiff = () =>{
    let currentUl = document.getElementById("page-changes");
    let file = getLandingFilePath();
    let info = getLandingFileDiff(file);
    console.log(info, "INFO WHY", file)
    console.log(getLandingFileList())

    currentUl.innerHTML = "";
    renderDiffBody(currentUl, file, info);
    
}

const changeMain = (evt) => { 
    if(! idMap.hasOwnProperty(evt.target.id)){
        return
    }
    if(getLandingFilePath()){
        document.getElementById(renderId(getLandingFilePath())).classList.remove('selected')
    }
    setLandingFile(idMap[evt.target.id])
    evt.target.classList.add('selected');
    renderCurrentDiff();
}


const fsOptions = {
    recursive: true,
}



initialize();
try{
    fs.watch(getRepoPath(), fsOptions, onUpdate);
}
catch(err){
    console.log("CANNOT AUTO-UPDATE DUE TO USE OF NON SUPPORTED OS")
}
