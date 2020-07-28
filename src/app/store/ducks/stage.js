const SET_STATUSRECORD = 'stage/SET_STATUSRECORD'
const SET_STATUSRECORDOBJ = 'stage/SET_STATUSRECORDOBJ'
const CLEAR_STATUSRECORD = 'stage/CLEAR_STATUSRECORD'

// DIFF
const SET_DIFFRECORD = 'stage/SET_DIFFRECORD'
const SET_DIFFRECORDOBJ = 'stage/SET_DIFFRECORDOBJ'
const CLEAR_DIFFRECORD = 'stage/CLEAR_DIFFRECORD'

const RESET_STAGE = 'stage/RESET_STAGE'

const initState = {
  status: {},
  diff: {}
}

export const stageReducer = (state = initState, action = {}) => {
  const newStatus = state.status
  const newDiff = state.diff
  
  switch(action.type){
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

    case RESET_STAGE:
      return {initState}
    default: 
      return state 
  }
}

//action creators
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

export const stageReset = () => {
  return { type: RESET_STAGE, payload: {}}
}