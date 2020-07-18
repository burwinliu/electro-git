const{
    setRepoPath,
    
    getRepoPath,
} = require('../store/repoStore')
const {
    setLandingReset,
    setLandingAddFileDiff,
    getLandingFileList,
    setLandingAddFileSummary,
    setLandingFilePath,

    getLanding,
    getLandingFileDiff,
    getLandingFilePath,
    getLandingFileStatus
    
} = require('../store/landingStore')

const {
    setUserName,
    setUserEmail,
    getGitObj,
    setBranchName,
} = require('../store/gitStore')

const{ 
    renderGitStatusMenuItem,
    renderGitDiffInfo, 
    renderId, 
    renderGitDiffBody, 

    helperGitAddCommit, 
    helperGitPush,
    helperGitOpen,
    helperGitBranch,
    helperGitDiff,
    helperGitStatus
} = require('../script/helperGitFunctions')

const fs = require('fs')

window.onload = function(){
    init();
}

// items
let fsWait = false;
let idMap = {}
let gitObject;

// Constants
const fsOptions = {
    recursive: true,
}

//functions for setup  
const init = async () =>{
    let itemHeader = document.getElementById("nav-currentrepo");
    
    setLandingReset();
    try{
        gitObject = helperGitOpen(String(getRepoPath()))
        
        let branch = await helperGitBranch(gitObject);
        if(branch.current === ""){
            itemHeader.innerHTML = "Path: " + getRepoPath() + ", Branch: UNSET";
        }
        else{
            itemHeader.innerHTML = "Path: " + getRepoPath() + ", Branch: " + branch.current;
        }
        
        await inputGitWrapper();

        try{
            console.log("LINKED")
            fs.watch(getRepoPath(), fsOptions, onUpdate);
        }
        catch(err){
            console.log("CANNOT AUTO-UPDATE DUE TO USE OF NON SUPPORTED OS")
        }
        
        return
    }
    catch(err){
        console.log("ERROR THROWN", err)
        // TODO -- Show error page instead
        // window.location.href = "index.html"
        // return;
    }
}

const onUpdate = async (event, file) => {
    if (fsWait) return;
    fsWait = setTimeout(() => {
        fsWait = false;
        }, 300 );
    console.log("updating")
    await inputGitWrapper();
    
}

const inputGitWrapper = async () => {
    await inputGitSummary();
    await inputGitDiff();
    await inputCurrentDiffBody();
}

const inputGitSummary = async () => {
    let currentUl = document.getElementById("side-diff-content-top");
    

    idMap = {}
    
    currentUl.innerHTML = '<li class="header"><input type="checkbox" checked="checked" class="side-check">Changed Files</li>'
    console.log(await helperGitStatus(gitObject))
    await helperGitStatus(gitObject).then((status) => {
        
        if( ! getLandingFileList().hasOwnProperty(getLandingFilePath())){
            setLandingFilePath(Object.keys(getLandingFileList)[0])
        }
        for(let i in status){
            
            let item = status[i]
            let liNode = renderGitStatusMenuItem(item)

            setLandingAddFileSummary(item.path, item.working_dir)
            idMap[liNode.id] = item.path;
            liNode.setAttribute("onclick","changeMain(event)");
            currentUl.appendChild(liNode);
        }
    })
    
}

const inputGitDiff = async (fileName) => {
    if(fileName){
        console.log("UPDATE ONLY ONE")
    }
    else{
        let gitDiff = await helperGitDiff(gitObject)
        let gitInfo = renderGitDiffInfo(gitDiff)

        for (let key in gitInfo) {
            setLandingAddFileDiff(key, gitInfo[key])
        }
    }
}

const inputCurrentDiffBody = async () =>{
    let currentUl = document.getElementById("page-changes");
    let file = getLandingFilePath();
    let status = getLandingFileStatus(file);
    let info = getLandingFileDiff(file);

    console.log(file, status, info)

    if(status == '!' || status == '?'){
        currentUl.innerHTML = 'File is untracked';
    }
    else if(!file || file == ""){
        currentUl.innerHTML = '';
        return;
    }
    else if(!info || !info.chunks){
        currentUl.innerHTML = 'The file can not be found for this file ' + file;
        return;
    }
    else{
        currentUl.innerHTML = '';
    

        testDiv = renderGitDiffBody(file, info);
        currentUl.appendChild(testDiv);
    
        console.log(file, info, testDiv, currentUl);
    }
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
    inputCurrentDiffBody();
}




// helper functions for responses
const gitCommit = async () => {
    // Render and get all checked items in the boxes
    toCommit = []
    for(let key in idMap){
        if(!document.getElementById(key)){
            idMap.remove(key);
        }
        if(document.getElementById(key+"_checked").checked){
            toCommit.push(idMap[key])
        }
    }

    //Commit all checked items
    await helperGitAddCommit(repo, toCommit, document.getElementById("footer-commitmsg").value);

    //Reset
    await inputGitWrapper();
    
    document.getElementById("page-changes").innerHTML = "";
}

const gitPush = async () => {
    let result = await helperGitPush(gitObject)

    if(!result){
        // FAILS HERE AND PROMPT WITH POPUP
        console.log(result)
    }
    
}