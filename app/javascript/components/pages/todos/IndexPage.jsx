import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import _ from 'lodash';

class IndexPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ids_to_edit: [],
      todo_name: ''
    }
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/todos/IndexPage ===', 'color: green; font-weight: bold;');

    const {
      cookies,
      loading,
      todos,
      setLoading,
      setTodos,
    } = this.props;

    const access_token = cookies.get('access_token');

    axios.get('/api/v1/users/1/todos', { headers: { Authorization: "Bearer " + access_token } })
      .then((response) => {
        setTodos(response.data.todos);
      });
  }

  handleCompletedChange(todo, event) {
    const { cookies, currentUser, signout, updateTodo } = this.props;
    const access_token = cookies.get('access_token');

    todo.completed = event.target.checked;

    axios.put(`/api/v1/users/${currentUser.id}/todos/${todo.id}`, { todo: todo }, { headers: { Authorization: "Bearer " + access_token } })
      .then((response) => {
        updateTodo(todo);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          cookies.remove('access_token');
          signout();
        }
      });
  }

  handleDelete(todo, event) {
    const { cookies, currentUser, deleteTodo, signout } = this.props;
    const access_token = cookies.get('access_token');

    if (!confirm('Are you sure?')) {
      return false;
    }

    axios.delete(`/api/v1/users/${currentUser.id}/todos/${todo.id}`, { headers: { Authorization: "Bearer " + access_token } })
      .then((response) => {
        deleteTodo(todo);
      })
      .catch((error) => {
        console.log('error.response = ', error.response)
        if (error.response.status === 401) {
          cookies.remove('access_token');
          signout();
        }
      });
  }

  handleCancelEdit(todo, event){
    const { ids_to_edit } = this.state;

    this.setState({
      ids_to_edit: ids_to_edit.filter(id => id !== todo.id)
    })
  }

  handleEdit(todo, event){
    const { ids_to_edit } = this.state;
    if (ids_to_edit.includes(todo.id)) {
      return false;
    }
    this.setState({
      ids_to_edit: [...ids_to_edit, todo.id]
    })
  }

  handleUpdate(todo, event){
    const { ids_to_edit } = this.state;
    const { cookies, currentUser, updateTodo } = this.props;
    const access_token = cookies.get('access_token');

    let input = document.getElementById(`edit-field-${todo.id}`);
    todo.name = input.value;

    axios.put(`/api/v1/users/${currentUser.id}/todos/${todo.id}`, { todo: { name: todo.name } }, { headers: { Authorization: "Bearer " + access_token } })
      .then((response) => {
        updateTodo(todo);
        this.setState({
          ids_to_edit: ids_to_edit.filter(id => id !== todo.id)
        })
      })
      .catch((error) => {
        console.log('error.response = ', error.response)
        if (error.response.status === 401) {
          cookies.remove('access_token');
          signout();
        }
      });
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


    axios.post(`/api/v1/users/${currentUser.id}/todos`, { todo: {  name: todo_name, completed: false } }, { headers: { Authorization: "Bearer " + access_token } })
      .then((response) => {
        addTodo(response.data);
        console.log('response = ', response);

        this.setState({ todo_name: '' });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          cookies.remove('access_token');
          signout();
        }
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
