import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getUserResponse = users => ({
  type: ActionType.GET_USER_ALL,
  users
});

export const getAllActiveUserResponse = usersActive => ({
  type: ActionType.GETALL_ACTIVE_USERS,
  usersActive
});

export const getUserByIdResponse = user => ({
  type: ActionType.GET_USER,
  user
});

export const addNewUserResponse = () => ({
  type: ActionType.ADD_NEW_USER_RESPONSE
});

export const updateExistingUserResponse = (user) => ({
  type: ActionType.UPDATE_EXISTING_USER_RESPONSE,
  user
});

export const deleteUserResponse = () => ({
  type: ActionType.DELETE_USER_RESPONSE
});

export function getUsersAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.USER_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(users => {
      dispatch(getUserResponse(users));
    })
    .catch(error => {
      throw error;
    });
  };
}

var userActions = {
  getAllUsers() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.USER_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(users => {
        dispatch(getUserResponse(users));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getAllActiveUsers() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.USER_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(usersActive => {
        dispatch(getAllActiveUserResponse(usersActive.data));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getUserById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.USER_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(user => {
        dispatch(getUserByIdResponse(user));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddUserWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDUSER_WINDOW,
        addingUser : true
      })
    }
  },
  openUpdateUserWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEUSER_WINDOW,
        updateUser : true
      })
    }
  },
  closeUserWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_USER_WINDOW,
        addingUser : false,
        updateUser : false
      })
    }
  },
  userInsert(user) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USER_INSERT,
        data: {
          ...user
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(() => {
        dispatch(addNewUserResponse());
      })
      .then(() => {
        dispatch(getUsersAction());
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  userUpdate(user) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USER_UPDATE,
        data: {
          ...user
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(() => {
        dispatch(updateExistingUserResponse(user));
      })
      .then(() => {
        dispatch(getUsersAction());
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  userDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.USER_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(() => {
        dispatch(deleteUserResponse());
      })
      .then(() => {
        dispatch(getUsersAction());
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = userActions;