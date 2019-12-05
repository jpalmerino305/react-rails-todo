import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Navigation from '../shared/Navigation';

import HomePage from '../pages/home/IndexPage';
import TodosPage from '../pages/todos/IndexPage';
import LoginPage from '../pages/sessions/LoginPage';

class Routes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      is_signed_in: false
    }
  }

  componentDidMount() {
    console.log('%c=== Mounted: components/utils/Routes ===', 'color: green; font-weight: bold;');
  }

  // A wrapper for <Route> that redirects to the signin
  // screen if you're not yet authenticated.
  privateRoute({ children, ...rest }) {
    const { is_signed_in } = this.state;

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

  renderAuthButton() {
    const { is_signed_in } = this.state;
    let button_text, buttonAction;

    if (is_signed_in) {
      button_text = 'Signout';
      buttonAction = this.signout.bind(this);
    } else {
      button_text = 'Signin';
      buttonAction = this.signin.bind(this);
    }

    return (
      <React.Fragment>
        { is_signed_in ? (<Redirect to={{ pathname: '/' }} />) : '' }
        { is_signed_in ? (<div style={{ color: 'green', display: 'inline-block', fontWeight: 'bold', marginRight: '10px' }}>Welcome!</div>) : '' }

        <button onClick={buttonAction}>{button_text}</button>
      </React.Fragment>
    );
  }

  render () {
    const PrivateRoute = this.privateRoute.bind(this);
    const { is_signed_in } = this.state;

    return (
      <Router>
        <div>

          <Navigation />
          { this.renderAuthButton() }

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
};

export default Routes;