const ADD_STATUSRECORD = 'REPO/ADD_STATUSRECORD'
const SET_STATUSRECORD = 'REPO_SET_STATUSRECORD'
const UPDATE_STATUSRECORD = 'REPO_UPDATE_STATUSRECORD'
const CLEAR_STATUSRECORD = 'REPO_CLEAR_STATUSRECORD'

// DIFF
const ADD_DIFFRECORD = 'REPO/ADD_DIFFRECORD'
const SET_DIFFRECORD = 'REPO_SET_DIFFRECORD'
const UPDATE_DIFFRECORD = 'REPO_UPDATE_DIFFRECORD'
const CLEAR_DIFFRECORD = 'REPO_CLEAR_DIFFRECORD'

export const stageReducer = (state = {}, actions = {}) => {
  switch(actions.type){
    case ADD_STATUSRECORD:
      return { ...state, username: action.payload };
    case SET_STATUSRECORD:
      return { ...state, username: action.payload };
    case UPDATE_STATUSRECORD:
      return { ...state, username: action.payload };
    case CLEAR_STATUSRECORD:
      return { ...state, username: action.payload };
    case ADD_DIFFRECORD:
      return { ...state, username: action.payload };
    case SET_DIFFRECORD:
      return { ...state, username: action.payload };
    case UPDATE_DIFFRECORD:
      return { ...state, username: action.payload };
    case CLEAR_DIFFRECORD:
      return { ...state, username: action.payload };
    default: 
      return state 
  }
}

//action creators
// export const repoSetUsername = (username) => {
//   return { type: SET_USERNAME, payload: username }
// }
// export const repoSetEmail = (email) => {
//   return { type: SET_EMAIL, payload: email }
// }
// export const repoSetPath = (path) => {
//   return { type: SET_PATH, payload: path }
// }