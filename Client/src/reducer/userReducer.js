import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const userReducer = (state = initialState.userReducer, action) => {
  switch(action.type) {
    case ActionType.GET_USER_ALL: {
      return {
        ...state,
        userList: _.assign(action.users.data)
      };
    }
    case ActionType.GETALL_ACTIVE_USERS: {
      return {
        ...state,
        usersActive: _.assign(action.usersActive)
      };
    }
    case ActionType.OPEN_ADDUSER_WINDOW : {
      return {
        ...state,
        addingUser: action.addingUser
      };
    }
    case ActionType.CLOSE_USER_WINDOW: {
      return {
        ...state,
        addingUser: action.addingUser,
        updateUser: action.updateUser
      };
    }
    case ActionType.OPEN_UPDATEUSER_WINDOW : {
      return {
        ...state,
        updateUser: action.updateUser
      };
    }

    case ActionType.GET_USER: {
      return {
        ...state,
        user: _.assign(action.user.data)
      };
    }
    case ActionType.UPDATE_EXISTING_USER_RESPONSE: {
      return {
        ...state,
        user: _.assign(action.user.data)
      };
    }

    default: { return state; }
  }
};

export default userReducer;