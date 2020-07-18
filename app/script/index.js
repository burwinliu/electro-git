// ~/app/script/index.js

//Imports
const {
    // For forms
    setRequiresUrl, 
    setFormPath, 
    setResetForm,

    getForm, 
    getIsFilled
} = require("../store/formStore")

const {
    // For repo
    setRepoPath,
    setAddRepoStore
} = require('../store/repoStore')

const {
    helperGitClone,
    helperGitOpen,
    helperGitInit 
} = require('../script/helperGitFunctions')

const { dialog } = require('electron').remote
const fs = require('fs')

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



// For response to the opening of the directory button on main form, will open a directory select window and respond in kinda
const selectDirectory = (toSet) => {
    dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
        .then((result) => {
            if(result.canceled){
                return;
            }
            else{
                document.getElementById(toSet).value = result.filePaths[0];
                setFormPath({path:result.filePaths[0],});
                if(getIsFilled()){
                    document.getElementById(correspondingBtn[toSet]).classList.remove("disabled");
                }
            }
        }
    );
};

// For response to change in input box, checking if it is has file path and is filled
const checkChange = (instance) =>{
    setFormPath({path: document.getElementById(instance).value});
    if(getIsFilled()){
        document.getElementById(correspondingBtn[instance]).classList.remove("disabled")
    }
    else{
        document.getElementById(correspondingBtn[instance]).classList.add("disabled")
    }
}

// For response to change in input box, checking if it is a valid url and is filled
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

    if (form.path){
        try{
            let repo = await helperGitOpen(form.path)
            setRepoPath(form.path);

            window.location.href = "./landing.html"
            return
        }
        catch(err) {
            console.log(err);
        }        
    }
    onFailure('Open');
}

const makeDirectory = async () =>{
    const form = getForm();

    if (form.path){
        try{
            let repo = await helperGitOpen(form.path)
            helperGitInit(form.path);
            setRepoPath(form.path);

            window.location.href = "./landing.html"
            return
        }
        catch(err){
            console.log(err)
        }
    }
    onFailure('Open');
}

const cloneDirectory = async () =>{
    const form = getForm();
    let check = true;
    
    if (form.requiresURL && form.url){
        try{
            let repo = helperGitOpen(form.path)
            helperGitClone(repo, form.url, form.path);
            setRepoPath(form.path);

            window.location.href = "./landing.html"
            return
        }
        catch(err){
            console.log(err);
        }
    }
    onFailure('Clone');
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

//Initialize the HTNL
document.addEventListener(
    'DOMContentLoaded', 
    function() {
        var options = {
            dismissible: false,
            startingTop: '10%',
            endingTop: '20%',
            onOpenStart: setFormType,
        }
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
    }
);