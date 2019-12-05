import * as actionTypes from '../constants/authActionTypes';


export const signin = (user, access_token) => (dispatch) => {
  dispatch({ type: actionTypes.SIGNIN, payload: { user: user, access_token: access_token } });
};

export const signout = () => (dispatch) => {
  dispatch({ type: actionTypes.SIGNOUT, payload: null });
};
