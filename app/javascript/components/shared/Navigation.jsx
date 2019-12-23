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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginBottom: '30px' }}>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="navbar-nav mr-auto">
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>
                <Link to="/todos" className="nav-link">Todos</Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              {
                is_signed_in ? '' : (
                  <React.Fragment>
                    <li>
                      <Link to="/signin" className="nav-link"><i className="fas fa-user"></i>&nbsp;Signin</Link>
                    </li>
                    <li>
                      <Link to="/signup" className="nav-link"><i className="fas fa-user-plus"></i>&nbsp;Signup</Link>
                    </li>
                  </React.Fragment>
                )
              }
              {
                is_signed_in && !_.isEmpty(currentUser) ? (
                  <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-user"></i>&nbsp;{currentUser.email}
                      </a>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <Link to="/profile" className="dropdown-item">Profile</Link>
                        <Link to="#" className="dropdown-item" onClick={this.signout.bind(this)}>Signout</Link>
                      </div>
                  </li>
                ) : ''
              }
            </ul>
          </div>
        </nav>

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
