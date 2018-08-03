import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getRolePermissionByIdResponse = rolePermission => ({
  type: ActionType.GET_ROLEPERMISSION,
  rolePermission
});

export const addNewRolePermissionResponse = () => ({
  type: ActionType.ADD_NEW_ROLEPERMISSION_RESPONSE
});

var rolePermissionActions = {
  rolePermissionInsert(roleData) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.ROLEPERMISSION_INSERT,
        data: {
          ...roleData
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(() => {
        dispatch(addNewRolePermissionResponse());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        throw (error);
      });
    };
  },
  getRolePermissionById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.ROLEPERMISSION_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(rolePermission => {
        dispatch(getRolePermissionByIdResponse(rolePermission.data));
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        throw error;
      });
    };
  }
};

module.exports = rolePermissionActions;