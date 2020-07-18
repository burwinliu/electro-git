const {electroGitStore} = require('./mainStore')

const setLandingAddFileDiff = ( fileId, value ) => {
    let landing = getLanding();
    landing.changedFiles[fileId] =  value;
    electroGitStore.set('landing', landing)
}
const setLandingRemoveFileDiff = (fileId) => {
    let landing = getLanding();
    landing.changedFiles.remove(fileId);
    electroGitStore.set('landing', landing)
}
const setLandingAddFileSummary = (fileId, value) =>{
    let landing = getLanding();
    landing.summaryFile[fileId] =  value;
    electroGitStore.set('landing', landing)
}
const setLandingRemoveFileSummary = (fileId, value) =>{
    let landing = getLanding();
    landing.summaryFile.remove(fileId);
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
        summaryFile: {},
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
const getLandingFileStatus = (fildId) => {
    let landing = getLanding();
    return landing.summaryFile[fildId];
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
exports.setLandingAddFileDiff = setLandingAddFileDiff
exports.setLandingRemoveFileDiff = setLandingRemoveFileDiff
exports.setLandingReset = setLandingReset
exports.setLandingFilePath = setLandingFilePath
exports.setLandingAddFileSummary = setLandingAddFileSummary
exports.setLandingRemoveFileSummary = setLandingRemoveFileSummary

exports.getLandingFileList = getLandingFileList
exports.getLandingFileDiff = getLandingFileDiff
exports.getLandingFilePath = getLandingFilePath
exports.getLandingFileStatus = getLandingFileStatus
exports.getLanding = getLanding