const {electroGitStore} = require('./mainStore')

const setLandingAddFiles = ( fileId, value ) => {
    let landing = getLanding();
    landing.changedFiles[fileId] =  value;
    electroGitStore.set('landing', landing)
}

const setLandingRemoveFiles = (fileId) => {
    let landing = getLanding();
    landing.changedFiles.remove(fileId);
    electroGitStore.set('landing', landing)
}
const setLandingFilePath = (path) => {
    let newLanding = getLanding()
    newLanding.currentFile = path
    electroGitStore.set('landing', newLanding)
}
const setLandingReset = () => {
    landing = {
        currentFile: null,
        changedFiles: {},
    }
    electroGitStore.set('landing', landing)
}

const getLandingFileList = () => {
    return getLanding().changedFiles;
}
const getLandingFileDiff = (fildId) => {
    let landing = getLanding();
    return landing.changedFiles[fildId];
}
const getLandingFilePath = () => {
    return getLanding().currentFile
}
const getLanding = () => {
    if(!electroGitStore.get('landing')){
        setLandingReset();
    }
    return electroGitStore.get('landing');
}

//Landing page information block
exports.setLandingAddFiles = setLandingAddFiles
exports.setLandingRemoveFiles = setLandingRemoveFiles
exports.setLandingReset = setLandingReset
exports.setLandingFilePath = setLandingFilePath

exports.getLandingFileList = getLandingFileList
exports.getLandingFileDiff = getLandingFileDiff
exports.getLandingFilePath = getLandingFilePath
exports.getLanding = getLanding