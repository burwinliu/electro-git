import { CONTENT_CONTROL, DIFF_CONTROL, HISTORY_CONTROL } from "."

// Selected file to view diff
const SET_CURRENT_DIFF = "appstore/SET_CURRENT_DIFF"
const SET_CURRENT_LOG_LINE = "appstore/SET_CURRENT_LOG_LINE"

//SELECT history hash to be viewed
const SET_CURRENT_HIST_REPO_FILE = "appstore/SET_CURRENT_HIST_REPO_FILE"
// SELECT file to be viewed
const SET_CURRENT_HIST_FILE = "appstore/SET_CURRENT_HIST_FILE"
const SET_CURRENT_BRANCH = "appstore/SET_CURRENT_BRANCHNAME"
const RESET_APPSTORE = "appstore/RESET_APPSTORE"

const SET_CONTENT_CONTROL = "appstore/SET_CONTENT_CONTROL"
const SET_DIFF_CONTROL = "appstore/SET_DIFF_CONTROL"
const SET_HIST_CONTROL = "appstore/SET_HIST_CONTROL"

const initState={
  currentDiff: "",

  currentLogLine: {},

  currentHistRepoFile: "",

  //SELECT A FILE AS THE MAIN ITEM TO RENDER
  currentHistFile: "",

  branch: "" ,
  repoRecord: [],
  sidebarWidth: "300px",

  contentControl: 0,
  diffControl: 0,
  histControl: 0,
}

export const appstoreReducer = (state = initState, action = {}) => {
  switch(action.type){
    case SET_CURRENT_DIFF:
      return { ...state, currentDiff: action.payload };
    case SET_CURRENT_LOG_LINE:
      return {...state, currentLogLine: action.payload };
    case SET_CURRENT_HIST_REPO_FILE:
      return {...state, currentHistRepoFile: action.payload };
    case SET_CURRENT_HIST_FILE:
      return {...state, currentHistFile: action.payload};
    case SET_CURRENT_BRANCH: 
      return {...state, branch: action.payload};
    case SET_CONTENT_CONTROL: 
      return {...state, contentControl: action.payload}
    case SET_DIFF_CONTROL: 
      return {...state, diffControl: action.payload}
    case SET_HIST_CONTROL: 
      return {...state, histControl: action.payload}  
    case RESET_APPSTORE:
      return {...initState}
    default: 
      return state
  }
}

export const appstoreSetCurrentDiff = (fileId) => {
  return { type: SET_CURRENT_DIFF, payload: fileId }
}
export const appstoreSetLogLine = (logLine) => {
  return { type: SET_CURRENT_LOG_LINE, payload: logLine }
}
export const appstoreSetHistRepoFile = (hash) => {
  return { type: SET_CURRENT_HIST_REPO_FILE, payload: hash }
}
export const appstoreSetCurrentHistFile = (file) => {
  return { type: SET_CURRENT_HIST_FILE, payload: file }
}
export const appstoreSetBranch = (branchName) => {
  return {type: SET_CURRENT_BRANCH, payload:branchName}
}

export const appstoreSetHistControl = (control) => {
  return {type: SET_HIST_CONTROL, payload: control}
}
export const appstoreSetContentControl = (control) => {
  return {type: SET_CONTENT_CONTROL, payload: control}
}
export const appstoreSetDiffControl =  (control) => {
  return {type: SET_DIFF_CONTROL, payload: control}
}

export const appstoreReset = () => {
  return { type: RESET_APPSTORE, payload: {} }
}