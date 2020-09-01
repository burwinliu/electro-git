import { useSelector, useDispatch } from "react-redux";


import { 
    // gitStore
    gitReset,
    gitSetBranchList,
    gitSetStatusObj,
    gitSetStatusSummary,
    gitSetDiffObj,
    gitSetRepoLog,
    gitSetFileLog,

    // displayStateStore
    displayStateSetBranch,

    // controlStore
    controlSetLoadingMain,

} from "../ducks";

import {
    helperGitBranchList,
    helperGitStatus,
    helperGitDiff,
    helperGitLog,
    helperGitLogFile,

    renderGitDiffInfo,
} from "../../services";

// Thunks
export const gitRefresh = () => {
    return async (dispatch, getState) =>{
        const loading = getState().control.loading

        if(loading) return;

        dispatch(controlSetLoadingMain(true));


        const gitLocalPath = getState().git.path;
        const diffFile = getState().displayState.currentHistFile

        
        
        const branchList = await helperGitBranchList(gitLocalPath)
        
        const currStatus = await helperGitStatus(gitLocalPath)
        const currDiff = await helperGitDiff(gitLocalPath)
        const currLog = await helperGitLog(gitLocalPath)

        let currLogFile
        if (diffFile != ""){
            currLogFile =  helperGitLogFile(gitLocalPath, diffFile)
        }

        let storeStatus = {}
        let storeDiff = {}

        const statusObj = currStatus.files
        for (let index in statusObj){
            storeStatus[statusObj[index].path.replace(/"/g, "")] = statusObj[index]
        }

        const rendDiff = renderGitDiffInfo(currDiff)
        for (let index in rendDiff){
            storeDiff[index.replace(/"/g, "")] = rendDiff[index]
        }
        dispatch(gitReset());

        if (branchList){
            dispatch(gitSetBranchList(branchList.branches || {}))
            dispatch(displayStateSetBranch(branchList.current))
        }

        dispatch(gitSetStatusObj(storeStatus))
        dispatch(gitSetStatusSummary(currStatus))
        dispatch(gitSetDiffObj(storeDiff))

        if(Object.keys(branchList.branches).length === 0){
            dispatch(displayStateSetBranch("Master"))
            dispatch(controlSetLoadingMain(false));
            return
        }

        dispatch(gitSetRepoLog(currLog.all))

        if(diffFile === "") {
            dispatch(controlSetLoadingMain(false));
            return
        }
        dispatch(gitSetFileLog(currLogFile.all))

        dispatch(controlSetLoadingMain(false));
    }
    
}

export const gitCommit = () => {
    return (dispatch) => {
        
    }
}