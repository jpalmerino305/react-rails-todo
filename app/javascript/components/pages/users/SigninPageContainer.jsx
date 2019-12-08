import * as authActions from '../../../redux/actions/authActions';

import { connect } from 'react-redux';
import SigninPage from './SigninPage';

const mapStateToProps = (state) => ({
  is_signed_in: state.auth.is_signed_in,
});

const mapDispatchToProps = (dispatch) => ({
  signin: (user, access_token) => dispatch(authActions.signin(user, access_token))
});

export default connect(mapStateToProps, mapDispatchToProps)(SigninPage);