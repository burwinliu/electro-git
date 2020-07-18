const {electroGitStore} = require('./mainStore')

const setRequiresUrl = (new_state) =>{
    newForm = getForm();
    newForm.requiresURL = new_state;
    electroGitStore.set('form', newForm);
};

const setFormPath = (input) => {
    newForm = getForm();
    if(input.path){
        newForm.path = input.path;
        electroGitStore.set('form', newForm);
    }
    if(input.url){
        newForm.url = input.url;
        electroGitStore.set('form', newForm);
    }
};

const setResetForm = () => {
    form = {
        requiresURL: false,
        path: null,
        url: null,
    }
    electroGitStore.set('form', form);
}

const getForm = () => {
    if (!electroGitStore.get('form')){
        setResetForm()
    }
    return electroGitStore.get('form');
};

const getIsFilled = () => {
    form = getForm();
    if (form.requiresURL){
        return (form.url && form.path)
    }
    return (form.path)
}



//Form information block
exports.setRequiresUrl = setRequiresUrl;
exports.setFormPath = setFormPath;
exports.setResetForm = setResetForm;

exports.getForm = getForm;
exports.getIsFilled = getIsFilled;
