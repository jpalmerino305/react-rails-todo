import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';

class SigninPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error_message: '',

      email: '',
      password: ''
    }
  }

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/sessions/SigninPage ===', 'color: green; font-weight: bold;');
  }

  handleSignin(e){
    e.preventDefault();
    const { cookies, history, location, signin } = this.props;
    const { email, password } = this.state;
    const { from } = location.state || { from: { pathname: '/' } };

    axios.post('/api/v1/sessions', { email: email, password: password })
      .then((response) => {
        const access_token = response.data.access_token;
        const user = response.data.user;

        cookies.set('access_token', access_token);
        signin(user, access_token);
        history.replace(from);
      })
      .catch((error) => {
        console.log('error = ', error.response);
        console.log('message = ', error.response.data.message);
        this.setState({ error_message: error.response.data.message })
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
    const { email, error_message, password } = this.state;
    const { is_signed_in } = this.props;

    return (
      <React.Fragment>
        { is_signed_in ? (<Redirect to={{ pathname: '/' }} />) : '' }
        <div className="container" style={{ marginTop: '100px' }}>
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" className="mx-auto d-block rounded-circle" width="100" style={{ marginBottom: '20px' }} />
              {
                _.isEmpty(error_message) ? '' : (
                  <div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
                    {error_message}
                  </div>
                )
              }
            </div>

            <div className="col-lg-4 offset-lg-4">
              <form onSubmit={ this.handleSignin.bind(this) }>
                <div className="form-group">
                  <input type="email" name="email" className="form-control" placeholder="Email" onChange={ this.handleInputChange.bind(this) } value={email} />
                </div>
                <div className="form-group">
                  <input type="password" name="password" className="form-control" placeholder="Password" onChange={ this.handleInputChange.bind(this) } value={password} />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-secondary btn-block">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

}

SigninPage.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  is_signed_in: PropTypes.bool.isRequired,
  signin: PropTypes.func.isRequired
};

export default withCookies(withRouter(SigninPage));
