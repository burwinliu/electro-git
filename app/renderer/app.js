import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import configureStore from './store/store';

import {LobbyPage} from './features/lobby'
import {MainPage} from './features/main'


const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={LobbyPage} />
        <Route path="/main" component={MainPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('Root')
);
