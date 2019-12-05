import React from 'react';
import PropTypes from 'prop-types';

class LoginPage extends React.Component {

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/LoginPage ===', 'color: green; font-weight: bold;');
  }

  render () {
    return (
      <React.Fragment>
        <h1>Login Page</h1>
      </React.Fragment>
    );
  }

}

LoginPage.propTypes = {
};

export default LoginPage;
