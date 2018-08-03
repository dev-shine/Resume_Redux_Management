import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const userPermissionReducer = (state = initialState.userPermissionReducer, action) => {
  switch(action.type) {
    case ActionType.GET_USERPERMISSION: {
      return {
        ...state,
        userPermission: _.assign(action.userPermission)
      };
    }

    default: { return state; }
  }
};

export default userPermissionReducer;