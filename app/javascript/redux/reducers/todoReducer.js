import * as actionTypes from '../constants/todoActionTypes';

let initialState = {
  loading: false,
  todos: []
};

const todoReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_TODOS:
      return { ...state, todos: [ ...action.payload ] };

    case actionTypes.ADD_TODO:
      return { ...state, todos: [ ...state.todos, ...[action.payload] ] };

    case actionTypes.UPDATE_TODO:
      return { ...state, todos: state.todos.map((todo) => action.payload.id === todo.id ? action.payload : todo) };

    case actionTypes.DELETE_TODO:
      return { ...state, todos: state.todos.filter((todo) => action.payload.id !== todo.id) };

    default:
      return state;
  }
};

export default todoReducer;