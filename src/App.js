import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './store/store';

import {MenuBar} from './features/menuBar'
import {LobbyPage} from './features/lobby'

import {MainPage} from './features/main'
import { colors } from './styles/palette';


const {store, persistor} = configureStore();


export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>LOADING AT THE MOMENT</div>} persistor={persistor}>
        <div style={{flexDirection: "column"}}>
          <div style={{height: "1px", width:"100vw", backgroundColor: colors.menu}}/>
          <MenuBar/>
          <Router>
            <Switch>
              <Route exact path="/main" component={MainPage} />
              <Route path="/" component={LobbyPage} />
            </Switch>
          </Router>
        </div>
      </PersistGate>
    </Provider>
  )
}
