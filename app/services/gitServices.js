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

    async diff(sha){
        if (sha === ""){
            return await Git.Diff.indexToWorkdir(repo);
        }
        else{
            const commit = await repo.getCommit(sha);
            return await commit.getDiff();
        }
    }
    
}

exports.GitHelper = GitHelper;