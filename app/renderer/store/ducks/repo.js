//actions
const SET_USERNAME = "repo/SET_USERNAME"
const SET_EMAIL = "repo/SET_EMAIL"
const SET_PATH = "repo/SET_PATH"



//reducers
export const repoReducer = (state = {}, actions = {}) => {
  switch(actions.type){
    case SET_PATH:
      return { ...state, path: action.payload };
    default: 
      return state 
  }
}

//action creators

export const repoSetPath = (path) => {
  return { type: SET_PATH, payload: path }
}