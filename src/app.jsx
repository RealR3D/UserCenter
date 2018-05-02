import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {Router, hashHistory} from 'react-router';
import routes from './routes';
import configureStore from './store';
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={hashHistory} routes={routes} />
    </Provider>,
    document.getElementById('root')
);