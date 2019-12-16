import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';

class ChangeEmailModalComponent extends React.Component {

  constructor(props) {
    super(props);

    this.ref_form = React.createRef();
    this.ref_email = React.createRef();
    this.ref_email_confirmation = React.createRef();
    this.ref_password = React.createRef();

    this.state = {
      loading: false,
      errors: [],

      email: '',
      email_confirmation: '',
      password: '',

      currentUser: props.currentUser
    };
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/ChangeEmailModalComponent ===', 'color: green; font-weight: bold;');
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
    const { email, email_confirmation, password } = this.state;
    const { api, updateCurrentUser } = this.props;

    let errors = [];

    if (_.isEmpty(email)) {
      errors.push('New email can\'t be blank');
    }

    if (_.isEmpty(email_confirmation)) {
      errors.push('New email confirmation can\'t be blank');
    }

    if (_.isEmpty(password)) {
      errors.push('Password can\'t be blank');
    }

    if (!_.isEmpty(errors)) {
      this.setState({ errors: errors });
      return false;
    }

    // updateCurrentUser({ email: email });

    const user = {
      email: email,
      email_confirmation: email_confirmation,
      password: password
    }

    this.setState({ loading: true });
    api.put('/users/update_profile', { update_type: 'email', user: user })
      .then((response) => { updateCurrentUser({ email: response.data.user.email }) })
      .catch((error) => {
        console.log('error.response = ', error.response)
        const errors = error.response.data.errors;
        // this.setState({ errors: errors });
      })
      .finally(() => {
        this.setState({
          loading: false,
          // email: '',
          // email_confirmation: '',
          // password: '',
        });
      });
  }

  render () {
    const { email, email_confirmation, errors, loading, password } = this.state;
    const { currentUser, onClose, updateCurrentUser, show } = this.props;

    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Change Email Address</Modal.Title>
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
              <div className="font-weight-bold text-center" style={{ marginBottom: '20px' }}>{currentUser.email}</div>
            </div>
            <div className="form-group">
              <input type="text" name="email" className="form-control" placeholder="New Email Address" ref={this.ref_email} onChange={this.handleInputChange.bind(this)} value={email} disabled={loading} />
            </div>
            <div className="form-group">
              <input type="text" name="email_confirmation" className="form-control" placeholder="Confirm New Email Address" ref={this.ref_email_confirmation} onChange={this.handleInputChange.bind(this)} value={email_confirmation} disabled={loading} />
            </div>
            <hr />
            <div className="form-group">
              <input type="password" name="password" className="form-control" placeholder="Enter Your Password" ref={this.ref_password} onChange={this.handleInputChange.bind(this)} value={password} disabled={loading} />
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

ChangeEmailModalComponent.propTypes = {
  currentUser: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired
};

export default withCookies(ChangeEmailModalComponent);
