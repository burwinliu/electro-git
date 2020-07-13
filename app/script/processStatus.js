// const git =  require('electron').remote.require('nodegit');

const renderLi = (statusFile) => {
    newLi = document.createElement('li');
    newLi.innerHTML = statusFile.path();
    newLi.classList.add("landing-space");
    if (statusFile.isNew()){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right new">new_releases</i>`
    }
    else if (statusFile.isModified()){
        newLi.innerHTML = newLi.innerHTML + `<i class="material-icons right modify">autorenew</i>`
    }
    return newLi;
}

exports.renderLi = renderLi;