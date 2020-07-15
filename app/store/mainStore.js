const Store = require('electron-store');


const electroGitStore = new Store({
    form:{
        requiresURL: false,
        path: null,
        url: null,
    },
    repo:{
        repoPath: null,
        repoStore: [],
    }, 
    landing:{
        currentFile: null,
        changedFiles: [],
    },
    user:{
        userName: '',
        userEmail: '',
    }
});

exports.electroGitStore = electroGitStore



