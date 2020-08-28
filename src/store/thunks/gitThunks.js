import { useSelector, useDispatch } from "react-redux";


import { gitReset } from "../ducks";

// Thunks
export const gitRefresh = () => {
    const gitLocalPath = useSelector(state => state.git.path);

    const loading = useSelector(state => state.control.loading);

    const branchList = await helperGitBranchList(dirPath)

    if(loading) return;

    return (dispatch) =>{
        dispatch(gitReset());

        dispatch(gitSetBranchList(branchList.branches || {}))
        dispatch(displayStateSetBranch(branchList.current))

        helperGitStatus(dirPath).then((statusSummary) =>{
            let storeStatus = {}
            const statusObj = statusSummary.files
            for (let index in statusObj){
                storeStatus[statusObj[index].path.replace(/"/g, "")] = statusObj[index]
            }
            dispatch(gitSetStatusObj(storeStatus))
            dispatch(gitSetStatusSummary(statusSummary))
        })
        
        helperGitDiff(dirPath).then((statusDiff)=>{
            const rendDiff = renderGitDiffInfo(statusDiff)
            let storeDiff = {}
            for (let index in rendDiff){
                storeDiff[index.replace(/"/g, "")] = rendDiff[index]
            }
            dispatch(gitSetDiffObj(storeDiff))
        })

        if(Object.keys(branchList.branches).length === 0){
            dispatch(displayStateSetBranch("Master"))
            return
        }

        helperGitLog(dirPath).then((log)=>{
            if(loaded){
                dispatch(gitSetRepoLog(log.all))
            }
        })

        if(diffFile === "") return

        helperGitLogFile(dirPath, diffFile).then((log)=>{
            if(loaded){
                dispatch(gitSetFileLog(log.all))
            }
        })
    }
    
}

export const gitCommit = () => {
    return (dispatch) => {
        
    }
}