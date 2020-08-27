// TODO Split up Control, diff and loading info into different files
import { CONTENT_CONTROL, DIFF_CONTROL, HISTORY_CONTROL } from "."

const SET_CONTENT_CONTROL = "control/SET_CONTENT_CONTROL"
const SET_DIFF_CONTROL = "control/SET_DIFF_CONTROL"
const SET_HIST_CONTROL = "control/SET_HIST_CONTROL"

const RESET_CONTROL = "control/RESET_CONTROL"

const initState={

  sidebarWidth: "300px",
  loadingMain: false,
  loadingFetch: false,

  contentControl: 0,
  diffControl: 0,
  histControl: 0,
}

export const controlReducer = (state = initState, action = {}) => {
    switch(action.type){
        case SET_CONTENT_CONTROL: 
            return {...state, contentControl: action.payload}
        case SET_DIFF_CONTROL: 
            return {...state, diffControl: action.payload}
        case SET_HIST_CONTROL: 
            return {...state, histControl: action.payload}  
        case RESET_CONTROL:
            return initState
        default: 
            return state
    }
}

export const controlSetHistControl = (control) => {
    return {type: SET_HIST_CONTROL, payload: control}
}
export const controlSetContentControl = (control) => {
    return {type: SET_CONTENT_CONTROL, payload: control}
}
export const controlSetDiffControl =  (control) => {
    return {type: SET_DIFF_CONTROL, payload: control}
}

export const controlReset = () => {
    return {type: RESET_CONTROL, payload: {}}
}