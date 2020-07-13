const {electroGitStore} = require('./mainStore')

const setRepoPath = (path) =>{
    newRepo = getRepoObj();
    newRepo.path = path;
    electroGitStore.set('repo', newRepo);
}

const setAddRepoStore = (path) => {
    newRepo = getRepoObj();
    newRepo.repoStore.push(path)
    electroGitStore.set('repo', newRepo);
}

const setRemoveRepoStore = (path) => {
    newRepo = getRepoObj();
    temp = newRepo.repoStore
    const index = temp.indexOf(path);
    if (index > -1) {
        temp.splice(index, 1);
    }
    newRepo.repoStore = temp;
    electroGitStore.set('repo', newRepo);
}

const setResetRepoStore = (path) =>{
    newRepo =  {
        repoPath: null,
        repoStore: [],
    }
    electroGitStore.set('repo', newRepo);
}

const getRepoPath = () => {
    return getRepoObj().path;
}

const getAllRepoStore = () => {
    return getRepoObj().repoStore;
}

const getRepoObj = () => {
    if(!electroGitStore.get('repo')){
        repoStore = {
            repoPath: null,
            repoStore: [],
        };  
        electroGitStore.set('repo', repoStore)
    }
    return electroGitStore.get('repo');
}
//

//Repo information block
exports.setRepoPath = setRepoPath;
exports.setAddRepoStore = setAddRepoStore;
exports.setRemoveRepoStore = setRemoveRepoStore;

exports.getRepoPath = getRepoPath;
exports.getAllRepoStore = getAllRepoStore;
exports.getRepoObj = getRepoObj;