var Git = require("nodegit")

class GitHelper{
    constructor(){
        this.path = ""
        this.gitRepo = null
    }
    
    setRepoPath(path){
        this.path = path
    }

    setGitRepo(repo){
        this.gitRepo = repo
    }

    async openRepo(){
        gitRepo = await Git.Repository.open(this.path)
        this.setGitRepo(gitRepo)
    }

    async initRepo(){
        gitRepo = await Git.Repository.init(this.path)
        this.setGitRepo(gitRepo)
    }

    async cloneRepo(url){
        gitRepo = await Git.Clone.clone(url, this.path)
        this.setGitRepo(gitRepo)
    }

    async fetch(){
        this.gitRepo.fetch("origin")
    }
    
}

exports.GitHelper = GitHelper;


// const initRepo = async (path) => {
//     return await Git.Repository.open(path)
// }


// initRepo("C:\\Users\\burwi\\Notebook").then(async (repo) => {
//     repo.getStatus().then(function(statuses) {
//         console.log(statuses)
//     });
// })

// exports.initRepo = initRepo