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