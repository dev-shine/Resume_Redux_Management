import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const loginReducer = (state = initialState.loginReducer, action) => {
  switch(action.type) {
    case ActionType.LOGIN_RESPONSE: {
      return {
        ...state,
        loginResponse: _.assign(action.loginResponse)
      };
    }
    case ActionType.CHANGEPASSWORD_RESPONSE: {
      return {
        ...state,
        changePasswordResponse: _.assign(action.changePasswordResponse)
      };
    }
    case ActionType.FORGOTPASSWORD_RESPONSE: {
      return {
        ...state,
        forgotPasswordResponse: _.assign(action.forgotPasswordResponse)
      };
    }

    default: { return state; }
  }
};

export default loginReducer;