import * as authActions from '../../redux/actions/authActions';

import { connect } from 'react-redux';
import Routes from './Routes'

const mapStateToProps = (state) => ({
  is_signed_in: state.auth.is_signed_in,
});

const mapDispatchToProps = (dispatch) => ({
  signin: (user, access_token) => dispatch(authActions.signin(user, access_token)),
  signout: () => dispatch(authActions.signout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);