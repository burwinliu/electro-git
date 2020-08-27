// ~/renderer/store/store.js

import { createStore, applyMiddleware } from 'redux'

import {rootReducer} from './ducks'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const persistConfig = {
  key: 'root',
  storage,
}



const persistedReducer = persistReducer(persistConfig, rootReducer)
const middleware = [
  thunk, 
  logger
]


export default function configureStore() {
  const store = createStore(
    persistedReducer,
    applyMiddleware(...middleware)
  )
  
  const persistor = persistStore(store)

  return { store, persistor }
}
