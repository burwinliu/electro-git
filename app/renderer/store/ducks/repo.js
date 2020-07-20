//actions
const SET_PATH = "repo/SET_PATH"



//reducers
export const repoReducer = (state = {}, action = {}) => {
  switch(action.type){
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