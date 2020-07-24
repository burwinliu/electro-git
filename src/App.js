import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './store/store';

import {LobbyPage} from './features/lobby'
import {MainPage} from './features/main'


const {store, persistor} = configureStore();


export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route exact path="/main" component={MainPage} />
            <Route path="/" component={LobbyPage} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  )
}
