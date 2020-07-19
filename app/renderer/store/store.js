// ~/renderer/store/store.js

import { createBrowserHistory } from 'history'
import { compose, createStore, combineReducers } from 'redux'

import {repoReducer} from "./ducks/repo"
import {stageReducer} from "./ducks/stage"
import {userReducer} from "./ducks/user"


export const history = createBrowserHistory()

export default function configureStore(initialState) {
  return createStore(combineReducers({
    repoReducer,
    stageReducer,
    userReducer,
  }), initialState);
}
