import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const projectRoleReducer = (state = initialState.projectRoleReducer, action) => {
  switch(action.type) {
    case ActionType.GET_PROJECTROLE_ALL: {
      return {
        ...state,
        projectRoleList: _.assign(action.projectRoles.data)
      };
    }
    case ActionType.GETALL_ACTIVE_PROJECTROLES: {
      return {
        ...state,
        projectRolesActive: _.assign(action.projectRolesActive.data)
      };
    }
    case ActionType.OPEN_ADDPROJECTROLE_WINDOW : {
      return {
        ...state,
        addingProjectRole: action.addingProjectRole
      };
    }
    case ActionType.CLOSE_PROJECTROLE_WINDOW: {
      return {
        ...state,
        addingProjectRole: action.addingProjectRole,
        updateProjectRole: action.updateProjectRole
      };
    }
    case ActionType.OPEN_UPDATEPROJECTROLE_WINDOW : {
      return {
        ...state,
        updateProjectRole: action.updateProjectRole
      };
    }

    case ActionType.GET_PROJECTROLE: {
      return {
        ...state,
        projectRole: _.assign(action.projectRole.data)
      };
    }
    case ActionType.UPDATE_EXISTING_PROJECTROLE_RESPONSE: {
      return {
        ...state,
        projectRole: _.assign(action.projectRole.data)
      };
    }

    default: { return state; }
  }
};

export default projectRoleReducer;