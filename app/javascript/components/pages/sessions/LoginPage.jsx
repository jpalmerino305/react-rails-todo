import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: 'jp.almerino305@gmail.com',
      password: '1234567890'
    }
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/LoginPage ===', 'color: green; font-weight: bold;');
  }

  handleSignin(e){
    e.preventDefault();
    const { cookies, history, location, signin } = this.props;
    const { email, password } = this.state;
    const { from } = location.state || { from: { pathname: '/' } };

    axios.post('/api/v1/sessions', { email: email, password: password })
      .then((response) => {
        let status = response.status, access_token = response.data.access_token;

        cookies.set('access_token', access_token);
        signin({ email: email }, access_token);
        history.replace(from);
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
    const { email, password } = this.state;
    const { is_signed_in } = this.props;

    return (
      <React.Fragment>
        { is_signed_in ? (<Redirect to={{ pathname: '/' }} />) : '' }

       <form onSubmit={ this.handleSignin.bind(this) }>
          <div>
            <input type="email" name="email" placeholder="Email" onChange={ this.handleInputChange.bind(this) } value={email} />
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" onChange={ this.handleInputChange.bind(this) } value={password} />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </React.Fragment>
    );
  }

}

LoginPage.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  is_signed_in: PropTypes.bool.isRequired,
  signin: PropTypes.func.isRequired
};

export default withCookies(withRouter(LoginPage));
