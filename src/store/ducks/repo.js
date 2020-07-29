// store/ducks/repo.js -- A reducer that holds the repository settings as it is right now --

//actions
const SET_PATH = "repo/SET_PATH"
const SET_URL = "repo/SET_URL"
const RESET_REPO = "repo/RESET_REPO"

const initState = {path: "", url: ""}

//reducers
export const repoReducer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_PATH:
      return { ...state, path: action.payload };
    case SET_URL:
      return { ...state, url: action.payload };
    case RESET_REPO:
      return { initState };
    default: 
      return state 
  }
}

export const repoSetPath = (path) => {
  return { type: SET_PATH, payload: path }
}
export const repoSetUrl = (url) => {
  return { type: SET_URL, payload: url }
}
export const repoReset = (url) => {
  return { type: RESET_REPO, payload: url }
}