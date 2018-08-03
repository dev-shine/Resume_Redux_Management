import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getPermissionModuleResponse = permissionModules => ({
  type: ActionType.GET_PERMISSIONMODULE_ALL,
  permissionModules
});

var permissionModuleActions = {
  getAllPermissionModules() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.PERMISSIONMODULE_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(permissionModules => {
        dispatch(getPermissionModuleResponse(permissionModules.data));
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  }
};

module.exports = permissionModuleActions;