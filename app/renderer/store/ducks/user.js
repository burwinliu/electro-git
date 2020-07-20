const SET_USERNAME = "repo/SET_USERNAME"
const SET_EMAIL = "repo/SET_EMAIL"

export const userReducer = (state = {}, action = {}) => {
  switch(action.type){
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_EMAIL:
      return { ...state, email: action.payload };
    default: 
      return state 
  }
}

export const repoSetUsername = (username) => {
  return { type: SET_USERNAME, payload: username }
}
export const repoSetEmail = (email) => {
  return { type: SET_EMAIL, payload: email }
}