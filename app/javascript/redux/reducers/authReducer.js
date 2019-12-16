import * as actionTypes from '../constants/authActionTypes';

let initialState = {
  access_token: '',
  is_signed_in: false,
  currentUser: {}
};

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SIGNIN:
      return {
        ...state,
        is_signed_in: true,
        currentUser: action.payload.user,
        access_token: action.payload.access_token 
      };

    case actionTypes.SIGNOUT:
      return { ...state, ...initialState };

    case actionTypes.UPDATE:
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };

    default:
      return state;
  }
};

export default authReducer;