//store/ducks/stage -- a place to store the staging information of this current commit


// STATUS
// FOR STATUS SUMMARY
const SET_STATUSSUMMARY = 'stage/SET_STATUS_SUMMARY'
// FOR PARSED STATUS
const SET_STATUSRECORD = 'stage/SET_STATUSRECORD'
const SET_STATUSRECORDOBJ = 'stage/SET_STATUSRECORDOBJ'
const CLEAR_STATUSRECORD = 'stage/CLEAR_STATUSRECORD'

// DIFF
const SET_DIFFRECORD = 'stage/SET_DIFFRECORD'
const SET_DIFFRECORDOBJ = 'stage/SET_DIFFRECORDOBJ'
const CLEAR_DIFFRECORD = 'stage/CLEAR_DIFFRECORD'

// BRANCH
const SET_BRANCH_LIST = 'stage/SET_BRANCH_LIST'

// HISTORY
const SET_REPO_LOG = 'stage/SET_REPO_LOG'
const CLEAR_REPO_LOG = 'stage/CLEAR_REPO_LOG'
const SET_REPO_HIST_STATUS = 'stage/SET_REPO_STATUS'
const SET_REPO_HIST_DIFF = 'stage/SET_REPO_DIFF'

const SET_FILE_LOG = 'stage/SET_FILE_LOG'
const CLEAR_FILE_LOG = 'stage/CLEAR_FILE_LOG'
const SET_FILE_HIST_DIFF = 'stage/SET_FILE_DIFF'

const RESET_STAGE = 'stage/RESET_STAGE'

const initState = {
  statusSummary: {},
  // RENDERED VERSION OF STATUS SUMMARY OF THE FILES
  status: {},
  diff: {},

  repoLog: {},
  repoHistStatus: {},
  repoHistDiff: {},

  fileLog: {},
  fileHistDiff: {},

  branchList: {},
}

export const stageReducer = (state = initState, action = {}) => {
  const newStatus = state.status
  const newDiff = state.diff
  
  switch(action.type){
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

    case SET_REPO_LOG:
      return {...state, repoLog: action.payload}
    case CLEAR_REPO_LOG:
      return {...state, repoLog: {}}
    case SET_REPO_HIST_STATUS:
      return {...state, repoHistStatus: action.payload}
    case SET_REPO_HIST_DIFF:
      return {...state, repoHistDiff: action.payload}


    case SET_FILE_LOG:
      return {...state, fileLog: action.payload}
    case CLEAR_FILE_LOG:
      return {...state, fileLog: {}}
    case SET_FILE_HIST_DIFF:
      return {...state, fileHistDiff: action.payload}

    case SET_BRANCH_LIST:
      return {...state, branchList: action.payload}

    case RESET_STAGE:
      return {initState}
    default: 
      return state 
  }
}

//action creators
export const stageSetStatusSummary = (statusSummary) => {
  return { type: SET_STATUSSUMMARY, payload: statusSummary}
}

export const stageSetStatus = (fileId, fileStatus) => {
  return { type: SET_STATUSRECORD, payload: {
      id: fileId, 
      value: fileStatus
    } 
  }
}
export const stageSetStatusObj = (status) => {
  return { type: SET_STATUSRECORDOBJ, payload: status }
}
export const stageClearStatus = () => {
  return { type: CLEAR_STATUSRECORD, payload: {} }
}

export const stageSetDiff = (fileId, fileDiff) => {
  return { type: SET_DIFFRECORD, payload: {
      id: fileId, 
      value: fileDiff
    } 
  }
}
export const stageSetDiffObj = (diff) => {
  return { type: SET_DIFFRECORDOBJ, payload: diff }
}
export const stageClearDiff = () => {
  return { type: CLEAR_DIFFRECORD, payload: {} }
}

export const stageSetRepoLog = (log) => {
  return {type: SET_REPO_LOG, payload: log}
}
export const stageClearRepoLog = () => {
  return {type: CLEAR_REPOLOG, payload: {}}
}
export const stageSetRepoHistStatus = (status) => {
  return {type: SET_REPO_HIST_STATUS, payload: status}
}
export const stageSetRepoHistDiff = (diff) => {
  return {type: SET_REPO_HIST_DIFF, payload: diff}
}

export const stageSetFileLog = (log) => {
  return {type: SET_FILE_LOG, payload: log}
}
export const stageClearFileLog = () => {
  return {type: CLEAR_FILELOG, payload: {}}
}
export const stageSetFileHistDiff = (diff) => {
  return {type: SET_FILE_HIST_DIFF, payload: diff}
}

export const stageSetBranchList = (list) => {
  return {type: SET_BRANCH_LIST, payload: list}
}

export const stageReset = () => {
  console.log("RESET STAGE")
  return { type: RESET_STAGE, payload: {}}
}