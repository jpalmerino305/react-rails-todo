import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import _ from 'lodash';

class Navigation extends React.Component {

  componentDidMount() {
    console.log('%c=== Mounted: components/shared/Navigation ===', 'color: green; font-weight: bold;');
  }

  signout(e){
    e.preventDefault();
    const { cookies, signout } = this.props;

    signout();
    cookies.remove('access_token');
  }

  render () {
    const { currentUser, is_signed_in } = this.props;

    return (
      <React.Fragment>
        {
          is_signed_in && !_.isEmpty(currentUser) ? (
            <div style={{ color: 'green' }}>Welcome <b>{currentUser.email}</b>!</div>
          ) : ''
        }

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          {
            is_signed_in ? (
              <li>
                <Link to="#" onClick={this.signout.bind(this)}>Signout</Link>
              </li>
            ) : (
              <li>
                <Link to="/signin">Signin</Link>
              </li>
            )
          }
        </ul>
      </React.Fragment>
    );
  }

}

Navigation.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  currentUser: PropTypes.object.isRequired,
  is_signed_in: PropTypes.bool.isRequired,
  signout: PropTypes.func.isRequired
};

export default withCookies(Navigation);
