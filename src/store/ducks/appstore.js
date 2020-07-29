const SET_CURRENT_DIFF = "appstore/SET_CURRENT_DIFF"
const SET_CURRENT_HISTDIFF = "appstore/SET_CURRENT_HISTDIFF"

const SET_CURRENT_HIST_HASH = "appstore/SET_CURRENT_HISTHASH"
const SET_CURRENT_BRANCH = "appstore/SET_CURRENT_BRANCHNAME"
const RESET_APPSTORE = "appstore/RESET_APPSTORE"

const initState={
  currentDiff: "",
  currentHistDiff: "",
  currentHistHash: "",

  branch: "" ,
  repoRecord: [],
  sidebarWidth: "300px",

}

export const appstoreReducer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_CURRENT_DIFF:
      return { ...state, currentDiff: action.payload };
    case SET_CURRENT_HISTDIFF:
      return {...state, currentHistDiff: action.payload };
    case SET_CURRENT_HIST_HASH:
      return {...state, currentHistHash: action.payload };
    case SET_CURRENT_BRANCH: 
      return {...state, branch: action.payload};
    case RESET_APPSTORE:
      return {initState}
    default: 
      return state 
  }
}

export const appstoreSetCurrentDiff = (fileId) => {
  return { type: SET_CURRENT_DIFF, payload: fileId }
}
export const appstoreSetHistDiff = (fileId) => {
  return { type: SET_CURRENT_HISTDIFF, payload: fileId }
}
export const appstoreSetHistHash = (hash) => {
  return { type: SET_CURRENT_HIST_HASH, payload: hash }
}
export const appstoreSetBranch = (branchName) => {
  return {type: SET_CURRENT_BRANCH, payload:branchName}
}
export const appstoreReset = () => {
    return { type: RESET_APPSTORE, payload: {} }
}