import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // For development purposes only

import Routes from './utils/RoutesContainer';

import authReducer from '../redux/reducers/authReducer';
import todoReducer from '../redux/reducers/todoReducer';

const middlewares = [thunk];

const rootReducer = combineReducers({
  auth: authReducer,
  todo: todoReducer
});

// Install "Redux DevTools" chrome extension to inspect state inside redux store
const composeEnhancers = (process.env.RAILS_ENV === 'development') ? composeWithDevTools : compose;
const store = composeEnhancers(applyMiddleware(...middlewares))(createStore)(rootReducer);

class TodoApp extends React.Component {

  componentDidMount() {
    console.log('%c=== Mounted: components/TodoApp ===', 'color: green; font-weight: bold;');
  }

  render () {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );

  }

}

export default TodoApp;