const { electroGitStore } = require("./mainStore");

const setResetUserObj = () => {
    let userStore = {
        userName: '',
        userEmail: '',
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

const getUserName = (name) => {
    let userObj = getUserObj()
    return userObj.userName
}

const getUserEmail = (email) => {
    let userObj = getUserObj()
    return userObj.userEmail;
}


const getUserObj = () => {
    if(!electroGitStore.get('user')){
        setResetUserObj();
    }
    return electroGitStore.get('user');
}

exports.setUserName = setUserName
exports.setUserEmail = setUserEmail

exports.getUserName = getUserName
exports.getUserEmail = getUserEmail
exports.getUserObj = getUserObj