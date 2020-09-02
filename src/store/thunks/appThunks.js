import {
    configReset,
    controlReset,
    displayStateReset,
    gitReset,
    displayStateSetCurrentDiff
} from "../ducks"

export const switchGitDir = (newGitDir) => {
    return (dispatch) => {
        
    }
}

// Thunks
export const selectGitDiffDiff = (toRenderPath) => {
    return (dispatch) => {
        dispatch(displayStateSetCurrentDiff(toRenderPath))
    }
}

export const selectGitDiffHist = () => {
    return (dispatch) => {
        
    }
}

export const resetApp = () => {
    return (dispatch) => {
        dispatch(configReset())
        dispatch(controlReset())
        dispatch(displayStateReset())
        dispatch(gitReset())
    }
}