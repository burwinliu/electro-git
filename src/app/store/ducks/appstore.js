const SET_CURRENTDIFF = "appstore/SET_CURRENTDIFF"
const RESET_APPSTORE = "appstore/RESET_APPSTORE"

const initState={
  currentDiff: "",
  repoRecord: [],
  sidebarWidth: "300px",

}

export const appstoreReducer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_CURRENTDIFF:
        return { ...state, currentDiff: action.payload };
    case RESET_APPSTORE:
        return {initState}
    default: 
        return state 
  }
}

export const appstoreSetCurrentDiff = (fileId) => {
  return { type: SET_CURRENTDIFF, payload: fileId }
}
export const appstoreReset = () => {
    return { type: RESET_APPSTORE, payload: {} }
}