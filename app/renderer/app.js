import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './store/store';

import {LobbyPage} from './features/lobby'
import {MainPage} from './features/main'


const {store, persistor} = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <Route exact path="/main" component={MainPage} />
          <Route path="/" component={LobbyPage} />
        </Switch>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('Root')
);
