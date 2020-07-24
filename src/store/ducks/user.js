const SET_USERNAME = "repo/SET_USERNAME"
const SET_EMAIL = "repo/SET_EMAIL"

const RESET_USER = "repo/RESET_USER"

const initState={
  username: "",
  email: ""
}

export const userReducer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_EMAIL:
      return { ...state, email: action.payload };
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
export const userReset = () => {
  return { type: RESET_USER, payload: {} }
}