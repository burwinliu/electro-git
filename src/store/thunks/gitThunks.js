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
    helperGitFetch,

    renderGitDiffInfo,
} from "../../services";

// Thunks
export const gitRefresh = () => {
    return async (dispatch, getState) =>{
        const loading = getState().control.loadingMain
        // if(loading) return;

        dispatch(controlSetLoadingMain(true));


        const gitLocalPath = getState().git.path;
        const diffFile = getState().displayState.currentHistFile

        // let branchList, currStatus, currDiff, currLog, currLogFile;

        // helperGitBranchList(gitLocalPath).then((tBranch) => {
        //     branchList = tBranch
        //     console.log(tBranch, 1)
        //     console.log(helperGitStatus(gitLocalPath))
        //     return helperGitStatus(gitLocalPath)
        // }).then((tStatus) => {
        //     console.log(tStatus, 2)

        //     currStatus = tStatus
        //     console.log(currStatus, 2)

        //     console.log(helperGitDiff(gitLocalPath))
        //     return helperGitDiff(gitLocalPath)
        // }).then((tDiff) => {
        //     console.log(tDiff, 3)

        //     currDiff = tDiff

        //     return helperGitLog(gitLocalPath)
        // }).then((tLog) => {
        //     console.log(tLog, 4)

        //     currLog = tLog

        //     if (diffFile != ""){
        //         currLogFile =  helperGitLogFile(gitLocalPath, diffFile)
        //     }
        //     console.log(branchList, currStatus, currDiff, currLog, currLogFile)


        //     dispatch(controlSetLoadingMain(false));
        // })

        const branchList = await helperGitBranchList(gitLocalPath)
        const currStatus = await helperGitStatus(gitLocalPath)
        const currDiff = await helperGitDiff(gitLocalPath)
        const currLog = await helperGitLog(gitLocalPath)
        
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

export const gitFetch = () => {
    return async (dispatch) => {
        dispatch(controlSetLoadingFetch(true))
        const fetchedStatus = await helperGitFetch(dirPath)
        dispatch(gitSetStatusSummary(status))
    } 
}

export const gitCommit = () => {
    return (dispatch) => {
        
    }
}