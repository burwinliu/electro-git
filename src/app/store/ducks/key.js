const SET_FILE_KEY = "key/SET_FILE"
const RESET_KEY = "key/RESET_KEY"

const initState={
  keyLocation: "",
}

export const keyRenderer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_FILE_KEY:
        return { ...state, keyLocation: action.payload };
    case RESET_KEY:
        return {initState}
    default: 
        return state 
  }
}

export const keySetFile = (location) => {
  return { type: SET_FILE_KEY, payload: location }
}
export const appstoreReset = () => {
    return { type: RESET_KEY, payload: {} }
}