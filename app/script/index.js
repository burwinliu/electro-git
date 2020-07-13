const {
    // For forms
    setRequiresUrl, 
    setFormPath, 
    clearForm,

    getForm, 
    getIsFilled,
} = require("../store/formStore")

const {
    // For repo
    setRepoPath,
    setAddRepoStore,
} = require('../store/repoStore')

const { dialog } = require('electron').remote
const fs = require('fs')
const { app, BrowserWindow } = require('electron')

const git =  require('electron').remote.require('nodegit');

//Const info thats important
correspondingBtn = {
    'input-openrepo-directory-text':    'openrepo-btn',
    'input-createrepo-directory-text':  'createrepo-btn',
    'input-clonerepo-directory-text':   'clonerepo-btn',
    'input-url':                        'clonerepo-btn',
};

//helper functions
function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};



// For response to actions
const selectDirectory = (toSet) => {
    dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
        .then((result) => {
            if(result.canceled){
                return;
            }
            else{
                document.getElementById(toSet).value = result.filePaths[0];
                toAdd = {
                    path:result.filePaths[0],
                }
                setFormPath(toAdd);
                if(getIsFilled()){
                    document.getElementById(correspondingBtn[toSet]).classList.remove("disabled");
                }
            }
        }
    );
};

const checkChange = (instance) =>{
    toAdd = {
        path: document.getElementById(instance).value
    };
    setFormPath(toAdd);
    if(getIsFilled()){
        document.getElementById(correspondingBtn[instance]).classList.remove("disabled")
    }
    else{
        document.getElementById(correspondingBtn[instance]).classList.add("disabled")
    }
}

const checkURLChange = (instance) => {
    if(isValidURL(document.getElementById(instance).value)){
        toAdd = {
            url: document.getElementById(instance).value
        }
        setFormPath(toAdd);
    }
    if(getIsFilled()){
        document.getElementById(correspondingBtn[instance]).classList.remove("disabled")
    }
    else{
        document.getElementById(correspondingBtn[instance]).classList.add("disabled")
    }
}

//Response to Open, Make and Clone
const openDirectory = async () => {
    const form = getForm();
    let success = false;
    if (form.path){
        await git.Repository.open(form.path)
            .then((repo) => {
                setRepoPath(form.path);
                setAddRepoStore(form.path);
                success = true;
            }).catch((reasonForFailure) => {
                // failure is handled here
                onFailure(reasonForFailure + '. Open');
                success = false;
            });
        if(success){
            window.location.href = "./landing.html"
            return;
        }
    }
    onFailure('Open');
}

const makeDirectory = async () =>{
    const form = getForm();
    if (form.path){
        let success = false;
        await git.Repository.init(form.path, 0)
            .then((repo) => {
                setRepoPath(form.path);
                setAddRepoStore(form.path);
                success = true;
            }).catch((reasonForFailure) => {
                success = false;
                onFailure(reasonForFailure + '. Make');
            });
        if(success){
            window.location.href = "./landing.html"
            return;
        }
    }
    onFailure('Make');
}

const cloneDirectory = () =>{
}

const onFailure = (msg) => {
    M.toast({
        html: msg + ' failed. Please check your inputs', 
        classes: 'failure-toast',
    })
}

// For Modal opens and closes
const setFormType = (instance) =>{
    setRequiresUrl(instance.id == 'modal-form-clonerepo');
};

const resetForm = () =>{
    clearForm()
};

document.addEventListener(
    'DOMContentLoaded', 
    function() {
        var options = {
            dismissible: false,
            startingTop: '10%',
            endingTop: '20%',
            onOpenStart: setFormType,
            onCloseEnd: resetForm,
        }
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
    }
);