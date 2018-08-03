import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const roleReducer = (state = initialState.roleReducer, action) => {
  switch(action.type) {
    case ActionType.GET_ROLE_ALL: {
      return {
        ...state,
        roleList: _.assign(action.roles.data)
      };
    }
    case ActionType.GETALL_ACTIVE_ROLES: {
      return {
        ...state,
        rolesActive: _.assign(action.rolesActive)
      };
    }
    case ActionType.OPEN_ADDROLE_WINDOW : {
      return {
        ...state,
        addingRole: action.addingRole
      };
    }
    case ActionType.CLOSE_ROLE_WINDOW: {
      return {
        ...state,
        addingRole: action.addingRole,
        updateRole: action.updateRole
      };
    }
    case ActionType.OPEN_UPDATEROLE_WINDOW : {
      return {
        ...state,
        updateRole: action.updateRole
      };
    }
    case ActionType.GET_ROLE: {
      return {
        ...state,
        role: _.assign(action.role.data)
      };
    }
    case ActionType.UPDATE_EXISTING_ROLE_RESPONSE: {
      return {
        ...state,
        role: _.assign(action.role.data)
      };
    }

    default: { return state; }
  }
};

export default roleReducer;