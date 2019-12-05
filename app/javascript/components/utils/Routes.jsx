import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import _ from 'lodash';

import Navigation from '../shared/NavigationContainer';

import HomePage from '../pages/home/IndexPage';
import TodosPage from '../pages/todos/IndexPage';
import LoginPage from '../pages/sessions/LoginPageContainer';

class Routes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      is_signed_in: false
    }
  }

  componentDidMount() {
    console.log('%c=== Mounted: components/utils/Routes ===', 'color: green; font-weight: bold;');

    const { cookies, signin } = this.props;
    const access_token = cookies.get('access_token');

    if (!_.isEmpty(access_token)) {
      axios.get(`/api/v1/sessions?access_type=verify&access_token=${access_token}`)
        .then((response) => {
          signin(response.data.user, access_token);
        })
    }
  }

  // A wrapper for <Route> that redirects to the signin
  // screen if you're not yet authenticated.
  privateRoute({ children, ...rest }) {
    const { is_signed_in } = this.props;

    return (
      <Route
        { ...rest }
        render={({ location }) =>
          is_signed_in ? (
            children
          ) : (
            <Redirect to={{ pathname: '/signin', state: { from: location } }} />
          )
        }
      />
    );
  }

  signin() {
    this.setState({ is_signed_in: true });
  }

  signout() {
    this.setState({ is_signed_in: false });
  }

  render () {
    const PrivateRoute = this.privateRoute.bind(this);
    const { is_signed_in } = this.state;

    return (
      <Router>
        <div>

          <Navigation />

          <Switch>
            <PrivateRoute path="/todos">
              <TodosPage />
            </PrivateRoute>

            <Route path="/signin">
              <LoginPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>

          </Switch>

        </div>
      </Router>
    );
  }

}

Routes.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  is_signed_in: PropTypes.bool.isRequired,
  signin: PropTypes.func.isRequired
};

export default withCookies(Routes);