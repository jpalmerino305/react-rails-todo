import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import _ from 'lodash';

import styles from './IndexPageStyles.module.css';

class IndexPage extends React.Component {

  constructor(props) {
    super(props);

    this.api = this.axiosApiV1Instance();

    this.state = {
      ids_to_edit: [],
      todo_name: ''
    };
  }

  componentDidMount() {
    console.log('%c=== Mounted: components/pages/todos/IndexPage ===', 'color: green; font-weight: bold;');

    const {
      loading,
      todos,
      setLoading,
      setTodos,
    } = this.props;

    setTodos([]);
    this.api.get('/users/1/todos').then((response) => { setTodos(response.data.todos) });
  }

  axiosApiV1Instance() {
    const { cookies, signout } = this.props;

    let api = axios.create({
      baseURL: '/api/v1',
      timeout: 1000,
      headers: { 'Authorization': 'Bearer ' + cookies.get('access_token') }
    });

    api.interceptors.response.use((response) => {
        return response;
      }, (error) => {
        let status = error.response.status;

        if (status === 401) {
          signout();
          cookies.remove('access_token');
        }

        return Promise.reject(error);
      });

    return api;
  }

  handleCompletedChange(todo, event) {
    const { currentUser, updateTodo } = this.props;

    this.api.put(`/users/${currentUser.id}/todos/${todo.id}`, { todo: { ...todo, completed: event.target.checked } }).then((response) => { updateTodo(todo) });
  }

  handleDelete(todo, event) {
    const { currentUser, deleteTodo } = this.props;

    if (!confirm('Are you sure?')) {
      return false;
    }

    this.api.delete(`/users/${currentUser.id}/todos/${todo.id}`).then((response) => { deleteTodo(todo) });
  }

  handleCancelEdit(todo, event){
    const { ids_to_edit } = this.state;
    this.setState({ ids_to_edit: ids_to_edit.filter(id => id !== todo.id) });
  }

  handleEdit(todo, event){
    const { ids_to_edit } = this.state;
    if (ids_to_edit.includes(todo.id)) {
      return false;
    }
    this.setState({ ids_to_edit: [...ids_to_edit, todo.id] });
  }

  handleUpdate(todo, event){
    const { ids_to_edit } = this.state;
    const { currentUser, updateTodo } = this.props;

    let input = document.getElementById(`edit-field-${todo.id}`);
    todo.name = input.value;

    this.api.put(`/users/${currentUser.id}/todos/${todo.id}`, { todo: { name: todo.name } })
      .then((response) => {
        updateTodo(todo);
        this.setState({
          ids_to_edit: ids_to_edit.filter(id => id !== todo.id)
        })
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSaveTodo(event){
    event.preventDefault();
    const { todo_name } = this.state;
    const { addTodo, cookies, currentUser } = this.props;
    const access_token = cookies.get('access_token');

    this.api.post(`/users/${currentUser.id}/todos`, { todo: {  name: todo_name, completed: false } })
      .then((response) => {
        addTodo(response.data);
        this.setState({ todo_name: '' });
      });
  }

  renderTodoForm() {
    const { todo_name } = this.state;

    return (
      <React.Fragment>
        <form onSubmit={this.handleSaveTodo.bind(this)}>
          <input type="text" name="todo_name" placeholder="Todo Name" onChange={ this.handleInputChange.bind(this) } value={todo_name} />
          <button type="submit">Add</button>
        </form>
      </React.Fragment>
    );
  }

  renderTodoList(){
    const { ids_to_edit } = this.state;
    const { todos } = this.props;

    return (
      <React.Fragment>
        <table>
          <thead>
            <tr>
              <th>Todo</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {
              todos.map((todo) => (
                <tr key={todo.id}>
                  <td>
                    <input type="checkbox" id={`todo-${todo.id}`} defaultChecked={todo.completed} onChange={this.handleCompletedChange.bind(this, todo)} />
                    {
                      ids_to_edit.includes(todo.id) ? (
                        <input type="text" id={`edit-field-${todo.id}`} defaultValue={todo.name} />
                      ) : (
                        <label htmlFor={`todo-${todo.id}`} className={ todo.completed ? styles.completed : '' }>{todo.name}</label>
                      )
                    }
                  </td>
                  <td>
                    {
                      ids_to_edit.includes(todo.id) ? (
                        <React.Fragment>
                          <button onClick={this.handleUpdate.bind(this, todo)}>Save</button>
                          &nbsp;
                          <button onClick={this.handleCancelEdit.bind(this, todo)}>Cancel</button>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <button disabled={todo.completed} onClick={this.handleEdit.bind(this, todo)}>Edit</button>
                          &nbsp;
                          <button onClick={this.handleDelete.bind(this, todo)} className="btn">Delete</button>
                        </React.Fragment>
                      )
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </React.Fragment>
    );
  }

  render () {
    return (
      <React.Fragment>
        { this.renderTodoForm() }
        { this.renderTodoList() }
      </React.Fragment>
    );
  }

}

IndexPage.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,

  currentUser: PropTypes.object.isRequired,

  is_signed_in: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,

  todos: PropTypes.array.isRequired,

  setLoading: PropTypes.func.isRequired,
  setTodos: PropTypes.func.isRequired,
  addTodo: PropTypes.func.isRequired,
  updateTodo: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired
};

export default withCookies(IndexPage);
