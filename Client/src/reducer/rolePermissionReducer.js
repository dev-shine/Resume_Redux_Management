import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const rolePermissionReducer = (state = initialState.rolePermissionReducer, action) => {
  switch(action.type) {
    case ActionType.GET_ROLEPERMISSION: {
      return {
        ...state,
        rolePermission: _.assign(action.rolePermission)
      };
    }

    default: { return state; }
  }
};

export default rolePermissionReducer;