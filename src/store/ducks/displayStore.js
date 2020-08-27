// Selected file to view diff
const SET_CURRENT_DIFF = "display/SET_CURRENT_DIFF"
const SET_CURRENT_LOG_LINE = "display/SET_CURRENT_LOG_LINE"

//SELECT history hash to be viewed
const SET_CURRENT_HIST_REPO_FILE = "display/SET_CURRENT_HIST_REPO_FILE"
// SELECT file to be viewed
const SET_CURRENT_HIST_FILE = "display/SET_CURRENT_HIST_FILE"
const SET_CURRENT_BRANCH = "display/SET_CURRENT_BRANCHNAME"
const RESET_DISPLAY = "display/RESET_DISPLAYSTORE"

// repo record
const ADD_REPO_RECORD = "display/ADD_REPO_RECORD"
const REMOVE_REPO_RECORD = "display/REMOVE_REPO_RECORD"


const initState={
    currentDiff: "",
  
    currentLogLine: {},
  
    currentHistRepoFile: "",
  
    //SELECT A FILE AS THE MAIN ITEM TO RENDER
    currentHistFile: "",
  
    branch: "" ,
    repoRecord: [],

}

export const displayReducer = (state = initState, action = {}) => {
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

export const displayAddRepoRecord = (repoPath) => {
  const parsedPath = repoPath.replace(/\\/g,"\/");
  return { type: ADD_REPO_RECORD, payload: parsedPath}
}
export const displayRemoveRepoRecord = (repoPath) => {
  return { type: REMOVE_REPO_RECORD, payload: repoPath}
}

export const displaySetCurrentDiff = (fileId) => {
  return { type: SET_CURRENT_DIFF, payload: fileId }
}
export const displaySetLogLine = (logLine) => {
  return { type: SET_CURRENT_LOG_LINE, payload: logLine }
}
export const displaySetHistRepoFile = (hash) => {
  return { type: SET_CURRENT_HIST_REPO_FILE, payload: hash }
}
export const displaySetCurrentHistFile = (file) => {
  return { type: SET_CURRENT_HIST_FILE, payload: file }
}
export const displaySetBranch = (branchName) => {
  return {type: SET_CURRENT_BRANCH, payload:branchName}
}

export const displayReset = () => {
  return { type: RESET_DISPLAY, payload: {} }
}