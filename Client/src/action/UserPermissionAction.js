import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getUserPermissionByIdResponse = userPermission => ({
  type: ActionType.GET_USERPERMISSION,
  userPermission
});

export const addNewUserPermissionResponse = () => ({
  type: ActionType.ADD_NEW_USERPERMISSION_RESPONSE
});

var userPermissionActions = {
  userPermissionInsert(userData) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USERPERMISSION_INSERT,
        data: {
          ...userData
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(() => {
        dispatch(addNewUserPermissionResponse());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        throw (error);
      });
    };
  },
  getUserPermissionById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USERPERMISSION_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(userPermission => {
        dispatch(getUserPermissionByIdResponse(userPermission.data));
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

module.exports = userPermissionActions;