import * as actionTypes from '../constants/todoActionTypes';


export const setLoading = (loading) => (dispatch) => {
  dispatch({ type: actionTypes.SET_LOADING, payload: loading });
};

export const setTodos = (todos) => (dispatch) => {
  dispatch({ type: actionTypes.SET_TODOS, payload: todos });
};

export const addTodo = (todo) => (dispatch) => {
  dispatch({ type: actionTypes.ADD_TODO, payload: todo });
};

export const updateTodo = (todo) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_TODO, payload: todo });
};

export const deleteTodo = (todo) => (dispatch) => {
  dispatch({ type: actionTypes.DELETE_TODO, payload: todo });
};
