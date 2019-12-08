import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';

class SignupPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password_confirmation: ''
    }
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/SignupPage ===', 'color: green; font-weight: bold;');
  }

  handleSignup(e){
    e.preventDefault();
    const { cookies, history, location, signin } = this.props;
    const { email, password, password_confirmation } = this.state;
    const { from } = location.state || { from: { pathname: '/' } };

    axios.post('/api/v1/registrations', { user: { email: email, password: password, password_confirmation: password_confirmation } })
      .then((response) => {
        const access_token = response.data.access_token;
        const user = response.data.user;

        cookies.set('access_token', access_token);
        signin(user, access_token);
        history.replace(from);
      })
      .catch((error) => {
        console.log('error = ', error.response)
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  render () {
    const { email, password, password_confirmation } = this.state;
    const { is_signed_in } = this.props;

    return (
      <React.Fragment>
        { is_signed_in ? (<Redirect to={{ pathname: '/' }} />) : '' }

        <h1></h1>
        <form onSubmit={ this.handleSignup.bind(this) }>
          <div>
            <input type="email" name="email" placeholder="Email" onChange={ this.handleInputChange.bind(this) } value={email} />
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" onChange={ this.handleInputChange.bind(this) } value={password} />
          </div>
          <div>
            <input type="password" name="password_confirmation" placeholder="Password Confirmation" onChange={ this.handleInputChange.bind(this) } value={password_confirmation} />
          </div>
          <div>
            <button type="submit">Signup</button>
          </div>
        </form>
      </React.Fragment>
    );
  }

}

SignupPage.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  is_signed_in: PropTypes.bool.isRequired,
  signin: PropTypes.func.isRequired
};

export default withCookies(withRouter(SignupPage));
