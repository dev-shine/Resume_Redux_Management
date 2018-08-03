import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const loginResponse = (loginResponse) => ({
  type: ActionType.LOGIN_RESPONSE,
  loginResponse
});

export const changePasswordResponse = (changePasswordResponse) => ({
  type: ActionType.CHANGEPASSWORD_RESPONSE,
  changePasswordResponse
});

export const forgotPasswordResponse = (forgotPasswordResponse) => ({
  type: ActionType.FORGOTPASSWORD_RESPONSE,
  forgotPasswordResponse
});

var loginActions = {
    loginUser(credentials) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      return function (dispatch) {
        dispatch(ApiCallBeginAction());
        return axios({
          url: appConstants.LOGIN_DETAILS,
          data: {
            ...credentials
          },
          method: 'POST',
          crossOrigin: true
        })
        .then((loginResponseData) => {
          if (loginResponseData.statusText === constants.OK_STATUS)
          {
              if (loginResponseData.data.message === constants.OK)
              {
                  loginResponseData.data.data[0].Email = credentials.Email;
                  localStorage.setItem('ls_userSession', loginResponseData.data.data[0].Email);
                  localStorage.setItem('ls_userId', loginResponseData.data.data[0]._id);
                  localStorage.setItem('ls_userName', loginResponseData.data.data[0].FullName);
                  localStorage.setItem('userData', JSON.stringify(loginResponseData.data.data[0]));
                  localStorage.setItem('jwt', loginResponseData.data.id_token);
                  dispatch(loginResponse(loginResponseData));
              }
              else {
                dispatch(loginResponse(loginResponseData));
              }

              return loginResponseData;
          }

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        })
        .catch(error => {
          dispatch(ApiCallErrorAction());
          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
          throw (error);
        });
      };
    },
    logOutUser() {
      localStorage.removeItem('ls_userSession');
      localStorage.removeItem('ls_userName');
      localStorage.removeItem('ls_userId');
      localStorage.removeItem('userData');
      localStorage.removeItem('jwt');
    },
    changePassword(OldPassword, NewPassword) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      var Email = localStorage.getItem('ls_userSession');
      const userData = {
        OldPassword: OldPassword,
        NewPassword: NewPassword,
        Email: Email
      };

      return function (dispatch) {
        dispatch(ApiCallBeginAction());
        return axios({
          url: appConstants.CHANGE_PASSWORD,
          data: {
            ...userData
          },
          method: 'POST',
          crossOrigin: true,
          headers: {
            'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
          }
        })
        .then((changePasswordResponseData) => {
          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
          dispatch(changePasswordResponse(changePasswordResponseData.data));
          return changePasswordResponseData;
        })
        .catch(error => {
          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
          dispatch(ApiCallErrorAction());
          throw (error);
        });
      };
    },
    forgotPassword(userDetails) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      return function (dispatch) {
        dispatch(ApiCallBeginAction());
        return axios({
          url: appConstants.FORGOT_PASSWORD,
          data: {
              ...userDetails
          },
          method: 'POST'
        })
        .then((forgotPasswordResponseData) => {
          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
          dispatch(changePasswordResponse(forgotPasswordResponseData.data));
          return forgotPasswordResponseData;
        })
        .catch(error => {
          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
          dispatch(ApiCallErrorAction());
          throw (error);
        });
      };
    }
};

module.exports = loginActions;