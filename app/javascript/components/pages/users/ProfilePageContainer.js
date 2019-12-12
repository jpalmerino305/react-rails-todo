import * as authActions from '../../../redux/actions/authActions';

import { connect } from 'react-redux';
import ProfilePage from './ProfilePage';

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);