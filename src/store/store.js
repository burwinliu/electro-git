// ~/renderer/store/store.js

import { createStore, combineReducers } from 'redux'

import {appstore, key, repo, stage, user} from './ducks'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  appstore,
  key,
  repo,
  stage,
  user,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export default function configureStore() {
  const store = createStore(persistedReducer)
  const persistor = persistStore(store)
  return { store, persistor }
}
