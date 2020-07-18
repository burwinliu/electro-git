const { electroGitStore } = require("./mainStore");

const setResetGitStore = () => {
    let gitStore = {
        userName: null,
        userEmail: null,
        remoteUrl: null,
        remoteName: null,
        branchName: null,
    };  
    electroGitStore.set('user', gitStore)
}

const setUserName = (name) => {
    let gitObj = getGitObj()
    gitObj.userName = name;
    electroGitStore.set('user', gitObj)
}

const setUserEmail = (email) => {
    let gitObj = getGitObj()
    gitObj.userEmail = email;
    electroGitStore.set('user', gitObj)
}

const setRemoteUrl = (url) => {
    let gitObj = getGitObj()
    gitObj.remoteUrl = url
    electroGitStore.set('user', gitObj)
}

const setRemoteName = (name) => {
    let gitObj = getGitObj()
    gitObj.remoteName = name
    electroGitStore.set('user', gitObj)
}

const setBranchName = (name) => {
    let gitObj = getGitObj()
    gitObj.branchName = name
    electroGitStore.set('user', gitObj)
}

const getUserName = () => {
    let gitObj = getGitObj()
    return gitObj.userName
}

const getUserEmail = () => {
    let gitObj = getGitObj()
    return gitObj.userEmail;
}

const getRemoteUrl = () => {
    let gitObj = getGitObj()
    return gitObj.remoteUrl
}

const getRemoteName = () =>{
    let gitObj = getGitObj()
    return gitObj.remoteName
}

const getBranchName = () => {
    let gitObj = getGitObj()
    return gitObj.branchName
}

const getGitObj = () => {
    if(!electroGitStore.get('user')){
        setResetGitrObj();
    }
    return electroGitStore.get('user');
}



exports.setUserName = setUserName
exports.setUserEmail = setUserEmail
exports.setRemoteUrl = setRemoteUrl
exports.setRemoteName = setRemoteName
exports.setBranchName = setBranchName

exports.getUserName = getUserName
exports.getUserEmail = getUserEmail
exports.getGitObj = getGitObj
exports.getRemoteUrl = getRemoteUrl
exports.getRemoteName = getRemoteName
exports.getBranchName = getBranchName