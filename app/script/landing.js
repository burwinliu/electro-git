const{
    setRepoPath,
    getRepoPath,
} = require('../store/repoStore')
const {
    setLandingAddFiles,
    getLandingFileList,
    getLandingFileDiff,
    setLandingFilePath,
    getLandingFilePath 
} = require('../store/landingStore')

const {
    setUserName,
    setUserEmail,
    getUserObj
} = require('../store/userStore')

// const git = require('nodegit');
const{ renderStatusLi, renderGitDiffInfo, renderId, renderDiffBody, helperGitAddCommit} = require('../script/helperGitFunctions')

const git =  require('electron').remote.require('nodegit');
const fs = require('fs')

// items
let fsWait = false;
let idMap = {}

//functions for setup  
const initialize = async () =>{
    
    let itemHeader = document.getElementById("nav-currentrepo");
    if(! fs.existsSync(getRepoPath())){
        setRepoPath("")
        window.location.href = "index.html"
    }
    let repo = await git.Repository.open(String(getRepoPath()));
    let branch = await repo.getCurrentBranch();

    console.log("STUCK")

    itemHeader.innerHTML = "Branch: " + branch.shorthand() + ", Path: " + getRepoPath();
    
    renderGitInfo();
    renderCurrentDiff();
    console.log("PASSES")
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
    let currentUl = document.getElementById("side-diff-content-top");
    let repo = await git.Repository.open(String(getRepoPath()));
    let gitInfo = await renderGitDiffInfo(repo)
    
    currentUl.innerHTML = '<li class="header"><input type="checkbox" checked="checked" class="side-check">Changed Files</li>'
    
    await repo.getStatus().then((arrayStatusFile) => {
        if( ! getLandingFileList().hasOwnProperty(getLandingFilePath())){
            setLandingFilePath(Object.keys(getLandingFileList)[0])
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

    currentUl.innerHTML = "";
    renderDiffBody(currentUl, file, info);
    
}

const changeMain = (evt) => { 
    if(! idMap.hasOwnProperty(evt.target.id)){
        return
    }
    if(getLandingFilePath() &&  document.getElementById(renderId(getLandingFilePath()))){
        document.getElementById(renderId(getLandingFilePath())).classList.remove('selected')
    }
    setLandingFilePath(idMap[evt.target.id])
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

// helper functions for responses
const gitCommit = async () => {
    let repo = await git.Repository.open(String(getRepoPath()));

    toCommit = []
    for(let key in idMap){
        if(!document.getElementById(key)){
            idMap.remove(key);
        }
        if(document.getElementById(key+"_checked").checked){
            console.log("CHECKED ", idMap[key])
            toCommit.push(idMap[key])
        }
    }
    helperGitAddCommit(toCommit, repo)
}

const gitPush = () => {
    for(let key in idMap){
        console.log(key, idMap[key])
    }
}

