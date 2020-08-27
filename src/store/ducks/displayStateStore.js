// Selected file to view diff
const SET_CURRENT_DIFF = "displayState/SET_CURRENT_DIFF"
const SET_CURRENT_LOG_LINE = "displayState/SET_CURRENT_LOG_LINE"

//SELECT history hash to be viewed
const SET_CURRENT_HIST_REPO_FILE = "displayState/SET_CURRENT_HIST_REPO_FILE"
// SELECT file to be viewed
const SET_CURRENT_HIST_FILE = "displayState/SET_CURRENT_HIST_FILE"
const SET_CURRENT_BRANCH = "displayState/SET_CURRENT_BRANCHNAME"
const RESET_DISPLAY = "displayState/RESET_DISPLAYSTORE"

// repo record
const ADD_REPO_RECORD = "displayState/ADD_REPO_RECORD"
const REMOVE_REPO_RECORD = "displayState/REMOVE_REPO_RECORD"


const initState={
    currentDiff: "",
  
    currentLogLine: {},
  
    currentHistRepoFile: "",
  
    //SELECT A FILE AS THE MAIN ITEM TO RENDER
    currentHistFile: "",
  
    branch: "" ,
    repoRecord: [],

}

export const displayStateReducer = (state = initState, action = {}) => {
  switch(action.type){
    case ADD_REPO_RECORD:
      if (action.payload === "" ){
        return {...state}
      }
      if (state.repoRecord && state.repoRecord.indexOf(action.payload) !== -1){
        return {...state, repoRecord: state.repoRecord}
      }
      return { ...state, repoRecord: [...state.repoRecord || [], action.payload] };
    case REMOVE_REPO_RECORD:
      const newRecord = []
      for(let i in state.repoRecord){
        if(state.repoRecord[i] === action.payload){
          continue
        }
        else{
          newRecord.push(state.repoRecord[i])
        }
      }
      return { ...state, repoRecord: newRecord}
    case SET_CURRENT_DIFF:
      return { ...state, currentDiff: action.payload };
    case SET_CURRENT_LOG_LINE:
      return {...state, currentLogLine: action.payload };
    case SET_CURRENT_HIST_REPO_FILE:
      return {...state, currentHistRepoFile: action.payload };
    case SET_CURRENT_HIST_FILE:
      return {...state, currentHistFile: action.payload};
    case SET_CURRENT_BRANCH: 
      return {...state, branch: action.payload};
    case RESET_DISPLAY:
      return {...initState}
    default: 
      return state
  }
}

export const displayStateAddRepoRecord = (repoPath) => {
  const parsedPath = repoPath.replace(/\\/g,"\/");
  return { type: ADD_REPO_RECORD, payload: parsedPath}
}
export const displayStateRemoveRepoRecord = (repoPath) => {
  return { type: REMOVE_REPO_RECORD, payload: repoPath}
}

export const displayStateSetCurrentDiff = (fileId) => {
  return { type: SET_CURRENT_DIFF, payload: fileId }
}
export const displayStateSetLogLine = (logLine) => {
  return { type: SET_CURRENT_LOG_LINE, payload: logLine }
}
export const displayStateSetHistRepoFile = (hash) => {
  return { type: SET_CURRENT_HIST_REPO_FILE, payload: hash }
}
export const displayStateSetCurrentHistFile = (file) => {
  return { type: SET_CURRENT_HIST_FILE, payload: file }
}
export const displayStateSetBranch = (branchName) => {
  return {type: SET_CURRENT_BRANCH, payload:branchName}
}

export const displayStateReset = () => {
  return { type: RESET_DISPLAY, payload: {} }
}