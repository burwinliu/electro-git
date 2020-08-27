const SET_USERNAME = "config/SET_USERNAME"
const SET_EMAIL = "config/SET_EMAIL"
const SET_FILE_KEY = "config/SET_FILE"

const RESET_USER = "config/RESET_USER"

const initState={
  username: "",
  email: "",
  sshKeyPath: ""
}

export const configReducer = (state = initState, action = {}) => {
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

export const configSetUsername = (configname) => {
  return { type: SET_USERNAME, payload: configname }
}
export const configSetEmail = (email) => {
  return { type: SET_EMAIL, payload: email }
}
export const configSetKey = (path) => {
  return {type: SET_FILE_KEY, payload: email}
}
export const configReset = () => {
  return { type: RESET_USER, payload: {} }
}