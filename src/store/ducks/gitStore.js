//store/ducks/git -- a place to store the staging information of this current commit


// STATUS
const SET_PATH = "git/SET_PATH"
const SET_URL = "git/SET_URL"
const RESET_git = "git/RESET_git"

// FOR STATUS SUMMARY
const SET_STATUSSUMMARY = 'git/SET_STATUS_SUMMARY'
// FOR PARSED STATUS
const SET_STATUSRECORD = 'git/SET_STATUSRECORD'
const SET_STATUSRECORDOBJ = 'git/SET_STATUSRECORDOBJ'
const CLEAR_STATUSRECORD = 'git/CLEAR_STATUSRECORD'

// DIFF
const SET_DIFFRECORD = 'git/SET_DIFFRECORD'
const SET_DIFFRECORDOBJ = 'git/SET_DIFFRECORDOBJ'
const CLEAR_DIFFRECORD = 'git/CLEAR_DIFFRECORD'

// BRANCH
const SET_BRANCH_LIST = 'git/SET_BRANCH_LIST'

// HISTORY
const SET_GITSTORE_LOG = 'git/SET_git_LOG'
const CLEAR_GITSTORE_LOG = 'git/CLEAR_git_LOG'
const SET_GITSTORE_HIST_STATUS = 'git/SET_git_STATUS'
const SET_GITSTORE_HIST_DIFF = 'git/SET_git_DIFF'

const SET_FILE_LOG = 'git/SET_FILE_LOG'
const CLEAR_FILE_LOG = 'git/CLEAR_FILE_LOG'
const SET_FILE_HIST_DIFF = 'git/SET_FILE_DIFF'

const RESET_GIT = 'git/RESET_GIT'

const initState = {
  // RENDERED VERSION OF STATUS SUMMARY OF THE FILES
  path: "",
  url: "",

  status: {},
  diff: {},

  gitLog: {},
  gitHistStatus: {},
  gitHistDiff: {},

  fileLog: {},
  fileHistDiff: {},

  statusSummary: {},

  branchList: {},
}

export const gitReducer = (state = initState, action = {}) => {
  const newStatus = state.status
  const newDiff = state.diff
  
  switch(action.type){

    case SET_PATH:
      return { ...state, path: action.payload };
    case SET_URL:
      return { ...state, url: action.payload };

    case SET_STATUSSUMMARY:
      return { ...state, statusSummary: action.payload}
    case SET_STATUSRECORD:
      newStatus[action.payload.id] = action.payload.value
      return { ...state, status: newStatus };
    case SET_STATUSRECORDOBJ:
      return { ...state, status: action.payload}
    case CLEAR_STATUSRECORD:
      return { ...state, status: {} };
      
    case SET_DIFFRECORD:
      newDiff[action.payload.id] = action.payload.value
      return { ...state, diff: newDiff };
    case SET_DIFFRECORDOBJ:
      return {...state, diff: action.payload}
    case CLEAR_DIFFRECORD:
      return { ...state, diff: {} };

    case SET_GITSTORE_LOG:
      return {...state, gitLog: action.payload}
    case CLEAR_GITSTORE_LOG:
      return {...state, gitLog: {}}
    case SET_GITSTORE_HIST_STATUS:
      console.log("HIST ", action.payload)
      return {...state, gitHistStatus: action.payload}
    case SET_GISTORE_HIST_DIFF:
      console.log(action.payload, "SET git HIST")
      return {...state, gitHistDiff: action.payload}


    case SET_FILE_LOG:
      return {...state, fileLog: action.payload}
    case CLEAR_FILE_LOG:
      return {...state, fileLog: {}}
    case SET_FILE_HIST_DIFF:
      return {...state, fileHistDiff: action.payload}

    case SET_BRANCH_LIST:
      return {...state, branchList: action.payload}



    case RESET_GIT:
      return {initState}
    
    default: 
      return state 
  }
}

//action creators
export const gitSetStatusSummary = (statusSummary) => {
  return { type: SET_STATUSSUMMARY, payload: statusSummary}
}

export const gitSetStatus = (fileId, fileStatus) => {
  return { type: SET_STATUSRECORD, payload: {
      id: fileId, 
      value: fileStatus
    } 
  }
}
export const gitSetStatusObj = (status) => {
  return { type: SET_STATUSRECORDOBJ, payload: status }
}
export const gitClearStatus = () => {
  return { type: CLEAR_STATUSRECORD, payload: {} }
}

export const gitSetDiff = (fileId, fileDiff) => {
  return { type: SET_DIFFRECORD, payload: {
      id: fileId, 
      value: fileDiff
    } 
  }
}
export const gitSetDiffObj = (diff) => {
  return { type: SET_DIFFRECORDOBJ, payload: diff }
}
export const gitClearDiff = () => {
  return { type: CLEAR_DIFFRECORD, payload: {} }
}

export const gitSetgitLog = (log) => {
  return {type: SET_git_LOG, payload: log}
}
export const gitCleargitLog = () => {
  return {type: CLEAR_gitLOG, payload: {}}
}
export const gitSetgitHistStatus = (status) => {
  return {type: SET_git_HIST_STATUS, payload: status}
}
export const gitSetgitHistDiff = (diff) => {
  return {type: SET_GITSTORE_HIST_DIFF, payload: diff}
}

export const gitSetFileLog = (log) => {
  return {type: SET_FILE_LOG, payload: log}
}
export const gitClearFileLog = () => {
  return {type: CLEAR_FILELOG, payload: {}}
}
export const gitSetFileHistDiff = (diff) => {
  return {type: SET_FILE_HIST_DIFF, payload: diff}
}

export const gitSetBranchList = (list) => {
  return {type: SET_BRANCH_LIST, payload: list}
}

export const gitSetPath = (path) => {
  const replaceSlash = /\\/g
  const parsed = path.replace(replaceSlash, "/")
  return { type: SET_PATH, payload: parsed }
}
export const gitSetUrl = (url) => {
  return { type: SET_URL, payload: url }
}
export const gitReset = (url) => {
  return { type: RESET_git, payload: url }
}