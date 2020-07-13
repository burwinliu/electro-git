const{
    // For repo
    setRepoPath,
    getRepoPath,
    getRepoObj,
} = require('../store/repoStore')

// const git = require('nodegit');

const{ renderLi } = require('../script/processStatus')

const git =  require('electron').remote.require('nodegit');

const temp = async () =>{
    let currentUl = document.getElementById("side-diff");
    let itemHeader = document.getElementById("nav-currentrepo");
    

    repo = await git.Repository.open(String(getRepoPath()));
    branch = await repo.getCurrentBranch();
    itemHeader.innerHTML = "Branch: " + branch.shorthand() + ", Path: " + getRepoPath();
    await repo.getStatus().then((arrayStatusFile) => {
        for(let i =0; i<arrayStatusFile.length; ++i){
            let item = arrayStatusFile[i]
            currentUl.appendChild(renderLi(item));
        }
    })
}

temp();
