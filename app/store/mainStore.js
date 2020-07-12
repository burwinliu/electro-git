const Store = require('electron-store');


const electroGitStore = new Store({
    form:{
        requiresURL: false,
        path: null,
        url: null,
    },
    repo:{
        repoPath: "",
        repo: null,
    }
    
    
});

const setRequiresUrl = (new_state) =>{
    newForm = electroGitStore.get('form');
    newForm.requiresURL = new_state;
    electroGitStore.set('form', newForm);
};

const setFormPath = (input) => {
    newForm = electroGitStore.get('form');
    if(input.path){
        newForm.path = input.path;
        electroGitStore.set('form', newForm);
    }
    if(input.url){
        newForm.url = input.url;
        electroGitStore.set('form', newForm);
    }
};

const getForm = () => {
    return electroGitStore.get('form');
};

const getIsFilled = () => {
    form = electroGitStore.get('form');
    if (form.requiresURL){
        return (form.url && form.path)
    }
    return (form.path)
}

const clearForm = () => {
    form = {
        requiresURL: false,
        path: null,
        url: null,
    }
    electroGitStore.set('form', form);
}

const setRepoPath = (path) =>{
    newRepo = getRepoStore();
    newRepo.path = path;
    electroGitStore.set('repo', newRepo);
}

const setRepo = (repo) =>{
    newRepo = getRepoStore();
    newRepo.repo = repo;
    electroGitStore.set('repo', newRepo);
}

const getRepoPath = () => {
    return getRepoObj().repoPath;
}

const getRepo = () => {
    return getRepoObj().repo;
}

const getRepoStore = () => {
    return electroGitStore.get('repo');
}

//Form information block
exports.setRequiresUrl = setRequiresUrl;
exports.setFormPath = setFormPath;

exports.clearForm = clearForm;

exports.getForm = getForm;
exports.getIsFilled = getIsFilled;


//Repo information block
exports.setRepoPath = setRepoPath;
exports.setRepo = setRepo;

exports.getRepoPath = getRepoPath
exports.getRepo = getRepo;

