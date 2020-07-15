const { electroGitStore } = require("./mainStore");

const setResetUserObj = () => {
    let userStore = {
        userName: null,
        userEmail: null,
        remoteUrl: null,
    };  
    electroGitStore.set('user', userStore)
}

const setUserName = (name) => {
    let userObj = getUserObj()
    userObj.userName = name;
    electroGitStore.set('user', userObj)
}

const setUserEmail = (email) => {
    let userObj = getUserObj()
    userObj.userEmail = email;
    electroGitStore.set('user', userObj)
}

const setRemoteUrl = (url) => {
    let userObj = getUserObj()
    userObj.remoteUrl = url
    electroGitStore.set('user', userObj)
}

const getUserName = () => {
    let userObj = getUserObj()
    return userObj.userName
}

const getUserEmail = () => {
    let userObj = getUserObj()
    return userObj.userEmail;
}

const getRemoteUrl = () => {
    let userObj = getUserObj()
    return userObj.remoteUrl
}

const getUserObj = () => {
    if(!electroGitStore.get('user')){
        setResetUserObj();
    }
    return electroGitStore.get('user');
}



exports.setUserName = setUserName
exports.setUserEmail = setUserEmail
exports.setRemoteUrl = setRemoteUrl

exports.getUserName = getUserName
exports.getUserEmail = getUserEmail
exports.getUserObj = getUserObj
exports.getRemoteUrl = getRemoteUrl