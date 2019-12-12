import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);

    this.api = this.axiosApiV1Instance();

    this.change_password_state = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }

    this.change_email_state = {
      new_email: '',
      new_email_confirmation: ''
    }

    const state = {
      show_change_email_modal: false,
      show_change_password_modal: false,
    }

    this.state = { ...state, ...this.change_password_state, ...this.change_email_state };

    this.type_profile = 'profile_information';
    this.type_password = 'password_change';
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/ProfilePage ===', 'color: green; font-weight: bold;');
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

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  renderChangeEmail() {
    const { show_change_email_modal } = this.state;
    const { currentUser } = this.props;

    return (
      <Modal show={show_change_email_modal} onHide={()=>{}}>
        <Modal.Header>
          <Modal.Title>Change Email Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <div className="font-weight-bold text-center" style={{ marginBottom: '20px' }}>{currentUser.email}</div>
            </div>
            <div className="form-group">
              <input type="text" name="new_email" className="form-control" placeholder="New Email Address" />
            </div>
            <div className="form-group">
              <input type="text" name="new_email_confirmation" className="form-control" placeholder="Confirm Email Address" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={this.modalEditForm.bind(this, { type: this.type_profile, show: false })}>Close</button>
          <button className="btn btn-success">Save Changes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  changePassword(event) {
    event.preventDefault();
    const { current_password, password, password_confirmation } = this.state;
    const user = {
      current_password: current_password,
      password: password,
      password_confirmation: password_confirmation,
    }

    console.log('user = ', user);
    
    // this.api.put('/users/profile', { user: user }).then((response) => { updateCurrentUser(user) });
  }

  renderChangePassword() {
    const { current_password, password, password_confirmation, show_change_password_modal } = this.state;

    return (
      <Modal show={show_change_password_modal} onHide={()=>{}}>
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.changePassword.bind(this)}>
            <div className="form-group">
              <label htmlFor="email">Old Password</label>
              <input type="password" name="current_password" className="form-control"onChange={ this.handleInputChange.bind(this) } value={current_password} />
            </div>
            <hr />
            <div className="form-group">
              <label htmlFor="email">New Password</label>
              <input type="password" name="password" className="form-control"onChange={ this.handleInputChange.bind(this) } value={password} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Confirm Password</label>
              <input type="password" name="password_confirmation" className="form-control"onChange={ this.handleInputChange.bind(this) } value={password_confirmation} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={this.modalEditForm.bind(this, { type: this.type_password, show: false })}>Close</button>
          <button className="btn btn-success">Save Changes</button>
        </Modal.Footer>
      </Modal>
    );
  }

  modalEditForm(opts, event) {
    event.preventDefault();
    if (opts.type == this.type_profile) {
      this.setState({ show_change_email_modal: opts.show });
    } else if (opts.type == this.type_password) {
      this.setState({ show_change_password_modal: opts.show });
    }
  }

  render () {
    return (
      <React.Fragment>
        {this.renderChangeEmail()}
        {this.renderChangePassword()}

        <div className="container" style={{ marginTop: '100px' }}>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" className="mx-auto d-block rounded-circle" width="100" style={{ marginBottom: '20px' }} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 offset-lg-4">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Email</td>
                    <td>jp.almerino305@gmail.com</td>
                    <td>
                      <a href="#" onClick={this.modalEditForm.bind(this, { type: this.type_profile, show: true })}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>********</td>
                    <td>
                      <a href="#" onClick={this.modalEditForm.bind(this, { type: this.type_password, show: true })}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </React.Fragment>
    );
  }

}

ProfilePage.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  currentUser: PropTypes.object.isRequired
};

export default withCookies(ProfilePage);
