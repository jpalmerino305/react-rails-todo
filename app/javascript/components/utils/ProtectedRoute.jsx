import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import _ from 'lodash';

class ProtectedRoute extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('%c=== Mounted: components/utils/ProtectedRoute ===', 'color: green; font-weight: bold;');

    const { cookies, history, location, signin, signout } = this.props;
    const access_token = cookies.get('access_token');

    if (_.isEmpty(access_token)) {
      history.push('/signin', { from: location })
      return;
    }

    axios.get(`/api/v1/sessions?access_type=verify&access_token=${access_token}`)
      .then((response) => {
        console.log('response = ', response);
        signin(response.data.user, access_token);
      })
      .catch((error) => {
        const response = error.response;

        if (response.status === 401) {
          signout();
          cookies.remove('access_token');
          history.push('/signin', { from: location });
        }
      });
  }

  render () {
    const { is_signed_in, children } = this.props;

    if (!is_signed_in) {
      return (
        <React.Fragment>
          <h1>Authenticating...</h1>
        </React.Fragment>
      );
    }

    return (
      <div apiv1={'apiv1'}>{children}</div>
    );
  }

}

ProtectedRoute.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  is_signed_in: PropTypes.bool.isRequired,
  signin: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired
};

export default withCookies(withRouter(ProtectedRoute));