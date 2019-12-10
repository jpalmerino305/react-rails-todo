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
    console.log('props = ', this.props);

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
          <div className="input-group mb-3">
            <input type="text" name="todo_name" className="form-control" placeholder="Todo" aria-label="Todo" aria-describedby="basic-addon2" onChange={ this.handleInputChange.bind(this) } value={todo_name} />
            <div className="input-group-append">
              <button className="btn btn-success" type="submit">Add</button>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }

  renderTodoList(){
    const { ids_to_edit } = this.state;
    const { todos } = this.props;

    return (
      <React.Fragment>
        <div className="col-lg-6">

          <div className="card">
            <div className="card-body">

              { this.renderTodoForm() }
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Todo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    todos.map((todo) => (
                      <tr key={todo.id}>
                        <td className="text-right">
                          <input type="checkbox" id={`todo-${todo.id}`} defaultChecked={todo.completed} onChange={this.handleCompletedChange.bind(this, todo)} />
                        </td>
                        <td>
                          {
                            ids_to_edit.includes(todo.id) ? (
                              <React.Fragment>
                                <input type="text" className="form-control" id={`edit-field-${todo.id}`} defaultValue={todo.name} style={{ marginBottom: '5px' }} />
                                <button className="btn btn-outline-success btn-sm" onClick={this.handleUpdate.bind(this, todo)}>Save</button>
                                &nbsp;
                                <button className="btn btn-outline-secondary btn-sm" onClick={this.handleCancelEdit.bind(this, todo)}>Cancel</button>
                              </React.Fragment>
                            ) : (
                              <label htmlFor={`todo-${todo.id}`} className={ todo.completed ? styles.completed : '' }>{todo.name}</label>
                            )
                          }
                        </td>
                        <td className="text-right">
                          {
                            ids_to_edit.includes(todo.id) ? '' : (
                              <React.Fragment>
                                <button className="btn btn-outline-secondary btn-sm" disabled={todo.completed} onClick={this.handleEdit.bind(this, todo)}>Edit</button>
                                &nbsp;
                                <button className="btn btn-outline-danger btn-sm" onClick={this.handleDelete.bind(this, todo)}>Delete</button>
                              </React.Fragment>
                            )
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div> 
          </div>
        </div>
      </React.Fragment>
    );
  }

  render () {
    return (
      <React.Fragment>
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
