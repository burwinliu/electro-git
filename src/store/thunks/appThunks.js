import {
    configReset,
    controlReset,
    displayStateReset,
    gitReset
} from "../ducks"

// Thunks
export const resetApp = () => {
    return (dispatch) => {
        dispatch(configReset())
        dispatch(controlReset())
        dispatch(displayStateReset())
        dispatch(gitReset())
    }
}