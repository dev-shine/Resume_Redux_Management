import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getProjectRoleResponse = projectRoles => ({
  type: ActionType.GET_PROJECTROLE_ALL,
  projectRoles
});

export const getAllActiveProjectRoleResponse = projectRolesActive => ({
  type: ActionType.GETALL_ACTIVE_PROJECTROLES,
  projectRolesActive
});

export const getProjectRoleByIdResponse = projectRole => ({
  type: ActionType.GET_PROJECTROLE,
  projectRole
});

export const addNewProjectRoleResponse = () => ({
  type: ActionType.ADD_NEW_PROJECTROLE_RESPONSE
});

export const updateExistingProjectRoleResponse = (projectRole) => ({
  type: ActionType.UPDATE_EXISTING_PROJECTROLE_RESPONSE,
  projectRole
});

export const deleteProjectRoleResponse = () => ({
  type: ActionType.DELETE_PROJECTROLE_RESPONSE
});

export function getProjectRolesAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.PROJECTROLE_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(projectRoles => {
      dispatch(getProjectRoleResponse(projectRoles));
    })
    .catch(error => {
      throw error;
    });
  };
}

var projectRoleActions = {
  getAllProjectRoles() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.PROJECTROLE_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(projectRoles => {
        dispatch(getProjectRoleResponse(projectRoles));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getProjectRoleById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.PROJECTROLE_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(projectRole => {
        dispatch(getProjectRoleByIdResponse(projectRole));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddProjectRoleWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDPROJECTROLE_WINDOW,
        addingProjectRole : true
      })
    }
  },
  openUpdateProjectRoleWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEPROJECTROLE_WINDOW,
        updateProjectRole : true
      })
    }
  },
  closeProjectRoleWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_PROJECTROLE_WINDOW,
        addingProjectRole : false,
        updateProjectRole : false
      })
    }
  },
  getAllActiveProjectRoles() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.PROJECTROLE_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(projectRolesActive => {
        dispatch(getAllActiveProjectRoleResponse(projectRolesActive));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  projectRoleInsert(projectRole) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.PROJECTROLE_INSERT,
        data: {
          ...projectRole
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewProjectRoleResponse());
        dispatch(getProjectRolesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  projectRoleUpdate(projectRole) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.PROJECTROLE_UPDATE,
        data: {
          ...projectRole
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingProjectRoleResponse(projectRole));
        dispatch(getProjectRolesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  projectRoleDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.PROJECTROLE_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteProjectRoleResponse());
         dispatch(getProjectRolesAction());
         return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = projectRoleActions;