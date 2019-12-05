import * as authActions from '../../redux/actions/authActions';

import { connect } from 'react-redux';
import Navigation from './Navigation';

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
  is_signed_in: state.auth.is_signed_in,
});

const mapDispatchToProps = (dispatch) => ({
  signout: () => dispatch(authActions.signout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);