import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { BrowserRouter, Router } from 'react-router-dom';

import { history } from './helpers';

import './index.scss';
import 'react-table/react-table.css'
import App from './App';
import rootReducer from "./reducers/index";
import * as serviceWorker from './serviceWorker';

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware, logger)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router history={history}>
        <App />
      </Router>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
