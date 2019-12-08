import * as authActions from '../../../redux/actions/authActions';
import * as todoActions from '../../../redux/actions/todoActions';

import { connect } from 'react-redux';
import IndexPage from './IndexPage';

const mapStateToProps = (state) => ({
  is_signed_in: state.auth.is_signed_in,
  currentUser: state.auth.currentUser,

  loading: state.todo.loading,
  todos: state.todo.todos,
});

const mapDispatchToProps = (dispatch) => ({
  signout: () => dispatch(authActions.signout()),

  setLoading: (loading) => dispatch(todoActions.setLoading(loading)),
  setTodos: (todos) => dispatch(todoActions.setTodos(todos)),
  addTodo: (todo) => dispatch(todoActions.addTodo(todo)),
  updateTodo: (todo) => dispatch(todoActions.updateTodo(todo)),
  deleteTodo: (todo) => dispatch(todoActions.deleteTodo(todo))
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);