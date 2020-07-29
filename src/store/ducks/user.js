const SET_USERNAME = "repo/SET_USERNAME"
const SET_EMAIL = "repo/SET_EMAIL"
const SET_FILE_KEY = "repo/SET_FILE"

const RESET_USER = "repo/RESET_USER"

const initState={
  username: "",
  email: "",
  sshKeyPath: ""
}

export const userReducer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_FILE_KEY:
      return {...state, sshKeyPath: action.payload}
    case RESET_USER:
      return { initState }
    default: 
      return state 
  }
}

export const userSetUsername = (username) => {
  return { type: SET_USERNAME, payload: username }
}
export const userSetEmail = (email) => {
  return { type: SET_EMAIL, payload: email }
}
export const userSetKey = (path) => {
  return {type: SET_FILE_KEY, payload: email}
}
export const userReset = () => {
  return { type: RESET_USER, payload: {} }
}