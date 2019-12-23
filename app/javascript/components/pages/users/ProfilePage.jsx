import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies, Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import ChangeEmailModal from './ChangeEmailModalComponent';
import ChangePasswordModal from './ChangePasswordModalComponent';

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);

    this.api = this.axiosApiV1Instance();
    this.updateCurrentUser = this.updateCurrentUser.bind(this);

    this.state = {
      show_change_email_modal: false,
      show_change_password_modal: false
    };
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

  updateCurrentUser(user) {
    this.props.updateCurrentUser(user);
  }

  render () {
    const { currentUser } = this.props;
    const { show_change_email_modal, show_change_password_modal } = this.state;

    return (
      <React.Fragment>
        <ChangeEmailModal
          show={show_change_email_modal}
          currentUser={currentUser}
          onClose={() => this.setState({ show_change_email_modal: false })}
          updateCurrentUser={this.updateCurrentUser}
          api={this.api}
        />

        <ChangePasswordModal
          show={show_change_password_modal}
          currentUser={currentUser}
          onClose={() => this.setState({ show_change_password_modal: false })}
          updateCurrentUser={this.updateCurrentUser}
          api={this.api}
        />

        <div className="container" style={{ marginTop: '100px' }}>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" className="mx-auto d-block rounded-circle" style={{ marginBottom: '20px', width: '100px' }} />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 offset-lg-4">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Email</td>
                    <td>{currentUser.email}</td>
                    <td>
                      <a href="#" onClick={(event)=> {
                        this.setState({ show_change_email_modal: true });
                        event.preventDefault();
                      }}><i className="fas fa-pencil-alt"></i></a>
                    </td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>********</td>
                    <td>
                      <a href="#" onClick={(event)=> {
                        this.setState({ show_change_password_modal: true });
                        event.preventDefault();
                      }}><i className="fas fa-pencil-alt"></i></a>
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
  currentUser: PropTypes.object.isRequired,
  updateCurrentUser: PropTypes.func.isRequired
};

export default withCookies(ProfilePage);
