import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';

class ChangePasswordModalComponent extends React.Component {

  constructor(props) {
    super(props);

    this.ref_form = React.createRef();

    this.state = {
      loading: false,
      errors: [],

      current_password: '',
      password: '',
      password_confirmation: ''
    };
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/ChangePasswordModalComponent ===', 'color: green; font-weight: bold;');
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  update(event) {
    event.preventDefault();

    const { current_password, password, password_confirmation } = this.state;
    const { api, onClose } = this.props;
    const user = {
      current_password: current_password,
      password: password,
      password_confirmation: password_confirmation,
    }

    let errors = [];

    if (_.isEmpty(current_password)) {
      errors.push('Current Password can\'t be blank');
    }

    if (_.isEmpty(password)) {
      errors.push('Password can\'t be blank');
    }

    if (_.isEmpty(password_confirmation)) {
      errors.push('Password confirmation can\'t be blank');
    }

    if (!_.isEmpty(errors)) {
      this.setState({ errors: errors });
      return false;
    }

    this.setState({ loading: true });
    api.put('/users/update_profile', { update_type: 'password', user: user })
      .then((response) => {
        this.setState({ errors: [], current_password: '', password: '', password_confirmation: '' });
        onClose();
      })
      .catch((error) => {
        const errors = error.response.data.errors;
        this.setState({ errors: errors });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render () {
    const { errors, loading, current_password, password, password_confirmation } = this.state;
    const { onClose, show } = this.props;

    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            _.isEmpty(errors) ? '' : (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <ul>
                  { errors.map((error, index) => <li key={index}>{error}</li>) }
                </ul>
              </div>
            )
          }
          <form onSubmit={this.update.bind(this)} ref={this.ref_form}>
            <div className="form-group">
              <input type="password" name="current_password" className="form-control" placeholder="Old Password" onChange={this.handleInputChange.bind(this)} value={current_password} disabled={loading} />
            </div>
            <hr />
            <div className="form-group">
              <input type="password" name="password" className="form-control" placeholder="New Your Password" onChange={this.handleInputChange.bind(this)} value={password} disabled={loading} />
            </div>
            <div className="form-group">
              <input type="password" name="password_confirmation" className="form-control" placeholder="Password Confirmation" onChange={this.handleInputChange.bind(this)} value={password_confirmation} disabled={loading} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-success" onClick={() => this.ref_form.current.dispatchEvent(new Event('submit')) }>Save Changes</button>
        </Modal.Footer>
      </Modal>
    );
  }

}

ChangePasswordModalComponent.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withCookies(ChangePasswordModalComponent);
