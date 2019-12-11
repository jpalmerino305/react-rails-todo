import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';

class SignupPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: [],

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
        this.setState({ errors: error.response.data.errors })
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
    const { email, errors, password, password_confirmation } = this.state;
    const { is_signed_in } = this.props;

    return (
      <React.Fragment>
        { is_signed_in ? (<Redirect to={{ pathname: '/' }} />) : '' }
        <div className="container" style={{ marginTop: '100px' }}>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" className="mx-auto d-block rounded-circle" width="100" style={{ marginBottom: '20px' }} />
              {
                _.isEmpty(errors) ? '' : (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <ul>
                      { errors.map((error, index) => <li key={index}>{ error }</li>) }
                    </ul>
                  </div>
                )
              }
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 offset-lg-4">
              <form onSubmit={ this.handleSignup.bind(this) }>
                <div className="form-group">
                  <input type="email" name="email" className="form-control" placeholder="Email" onChange={ this.handleInputChange.bind(this) } value={email} />
                </div>
                <div className="form-group">
                  <input type="password" name="password" className="form-control" placeholder="Password" onChange={ this.handleInputChange.bind(this) } value={password} />
                </div>
                <div className="form-group">
                  <input type="password" name="password_confirmation" className="form-control" placeholder="Password Confirmation" onChange={ this.handleInputChange.bind(this) } value={password_confirmation} />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-success btn-block">Signup</button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
