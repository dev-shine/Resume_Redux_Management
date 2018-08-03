import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getRoleResponse = roles => ({
  type: ActionType.GET_ROLE_ALL,
  roles
});

export const getAllActiveRoleResponse = rolesActive => ({
  type: ActionType.GETALL_ACTIVE_ROLES,
  rolesActive
});

export const getRoleByIdResponse = role => ({
  type: ActionType.GET_ROLE,
  role
});

export const addNewRoleResponse = () => ({
  type: ActionType.ADD_NEW_ROLE_RESPONSE
});

export const updateExistingRoleResponse = (role) => ({
  type: ActionType.UPDATE_EXISTING_ROLE_RESPONSE,
  role
});

export const deleteRoleResponse = () => ({
  type: ActionType.DELETE_ROLE_RESPONSE
});

export function getRolesAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.ROLE_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(roles => {
      dispatch(getRoleResponse(roles));
    })
    .catch(error => {
      throw error;
    });
  };
}

var roleActions = {
  getAllRoles() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.ROLE_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(roles => {
        dispatch(getRoleResponse(roles));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getRoleById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.ROLE_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(role => {
        dispatch(getRoleByIdResponse(role));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddRoleWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDROLE_WINDOW,
        addingRole : true
      })
    }
  },
  openUpdateRoleWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEROLE_WINDOW,
        updateRole : true
      })
    }
  },
  closeRoleWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_ROLE_WINDOW,
        addingRole : false,
        updateRole : false
      })
    }
  },
  getAllActiveRoles() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.ROLE_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(rolesActive => {
        dispatch(getAllActiveRoleResponse(rolesActive.data));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  roleInsert(role) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.ROLE_INSERT,
        data: {
          ...role
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewRoleResponse());
        dispatch(getRolesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  roleUpdate(role) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.ROLE_UPDATE,
        data: {
          ...role
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingRoleResponse(role));
        dispatch(getRolesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  roleDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.ROLE_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteRoleResponse());
        dispatch(getRolesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = roleActions;