import {
    appstoreReset,
    repoReset,
    stageReset,
    userReset
} from "../ducks"

// Thunks
export const resetApp = () => {
    return (dispatch) => {
        dispatch(appstoreReset())
        dispatch(repoReset())
        dispatch(stageReset())
        dispatch(userReset())
    }
}