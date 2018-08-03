import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getUserRoleByIdResponse = userRole => ({
  type: ActionType.GET_USERROLE,
  userRole
});

export const addNewUserRoleResponse = () => ({
  type: ActionType.ADD_NEW_USERROLE_RESPONSE
});

var userRoleActions = {
  userRoleInsert(userRoleData) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USERROLE_INSERT,
        data: {
          ...userRoleData
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(() => {
        dispatch(addNewUserRoleResponse());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        throw (error);
      });
    };
  },
  getUserRoleById(id) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USERROLE_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(userRole => {
        dispatch(getUserRoleByIdResponse(userRole.data));
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

module.exports = userRoleActions;