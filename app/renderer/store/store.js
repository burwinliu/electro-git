// ~/renderer/store/store.js

import { compose, createStore, combineReducers } from 'redux'

import {repo, stage, user} from './ducks'


export default function configureStore(initialState) {
  return createStore(combineReducers({
    repo,
    stage,
    user,
  }), initialState);
}
