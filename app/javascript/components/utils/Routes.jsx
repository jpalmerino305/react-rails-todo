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

import ProtectedRoute from './ProtectedRouteContainer';

import Navigation from '../shared/NavigationContainer';

import HomePage from '../pages/home/IndexPage';
import TodosPage from '../pages/todos/IndexPageContainer';
import SigninPage from '../pages/users/SigninPageContainer';
import SignupPage from '../pages/users/SignupPageContainer';

class Routes extends React.Component {

  componentDidMount() {
    console.log('%c=== Mounted: components/utils/Routes ===', 'color: green; font-weight: bold;');
  }

  render () {
    return (
      <Router>
        <div>

          <Navigation />

          <Switch>
            <ProtectedRoute path="/todos">
              <TodosPage />
            </ProtectedRoute>

            <Route path="/signin">
              <SigninPage />
            </Route>
            <Route path="/signup">
              <SignupPage />
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
  signin: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired
};

export default withCookies(Routes);