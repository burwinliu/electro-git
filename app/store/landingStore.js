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

const setLandingReset = () => {
    landing = {
        currentFile: null,
        changedFiles: {},
    }
    electroGitStore.set('landing', landing)
}

const setLandingFile = (filePath) => {
    let landing = getLanding();
    landing.currentFile = filePath;
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
    let landing = getLanding();
    return landing.currentFile;
}

const getLanding = () => {
    return electroGitStore.get('landing');
}

//Landing page information block
exports.setLandingAddFiles = setLandingAddFiles
exports.setLandingRemoveFiles = setLandingRemoveFiles
exports.setLandingReset = setLandingReset
exports.setLandingFile = setLandingFile

exports.getLandingFileList = getLandingFileList
exports.getLandingFileDiff = getLandingFileDiff
exports.getLandingFilePath = getLandingFilePath
exports.getLanding = getLanding