import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getOperatingSystemResponse = operatingSystems => ({
  type: ActionType.GET_OPERATINGSYSTEM_ALL,
  operatingSystems
});

export const getAllActiveOperatingSystemResponse = operatingSystemsActive => ({
  type: ActionType.GETALL_ACTIVE_OPERATINGSYSTEMS,
  operatingSystemsActive
});

export const getOperatingSystemByIdResponse = operatingSystem => ({
  type: ActionType.GET_OPERATINGSYSTEM,
  operatingSystem
});

export const addNewOperatingSystemResponse = () => ({
  type: ActionType.ADD_NEW_OPERATINGSYSTEM_RESPONSE
});

export const updateExistingOperatingSystemResponse = (operatingSystem) => ({
  type: ActionType.UPDATE_EXISTING_OPERATINGSYSTEM_RESPONSE,
  operatingSystem
});

export const deleteOperatingSystemResponse = () => ({
  type: ActionType.DELETE_OPERATINGSYSTEM_RESPONSE
});

export function getOperatingSystemsAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.OPERATINGSYSTEM_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(operatingSystems => {
      dispatch(getOperatingSystemResponse(operatingSystems));
    })
    .catch(error => {
      throw error;
    });
  };
}

var operatingSystemActions = {
  getAllOperatingSystems() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.OPERATINGSYSTEM_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(operatingSystems => {
        dispatch(getOperatingSystemResponse(operatingSystems));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getAllActiveOperatingSystems() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.OPERATINGSYSTEM_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(operatingSystemsActive => {
        dispatch(getAllActiveOperatingSystemResponse(operatingSystemsActive));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getOperatingSystemById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.OPERATINGSYSTEM_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(operatingSystem => {
        dispatch(getOperatingSystemByIdResponse(operatingSystem));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddOperatingSystemWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDOPERATINGSYSTEM_WINDOW,
        addingOperatingSystem : true
      })
    }
  },
  openUpdateOperatingSystemWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEOPERATINGSYSTEM_WINDOW,
        updateOperatingSystem : true
      })
    }
  },
  closeOperatingSystemWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_OPERATINGSYSTEM_WINDOW,
        addingOperatingSystem : false,
        updateOperatingSystem : false
      })
    }
  },
  operatingSystemInsert(operatingSystem) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.OPERATINGSYSTEM_INSERT,
        data: {
          ...operatingSystem
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewOperatingSystemResponse());
        dispatch(getOperatingSystemsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  operatingSystemUpdate(operatingSystem) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.OPERATINGSYSTEM_UPDATE,
        data: {
          ...operatingSystem
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingOperatingSystemResponse(operatingSystem));
        dispatch(getOperatingSystemsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  operatingSystemDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.OPERATINGSYSTEM_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteOperatingSystemResponse());
        dispatch(getOperatingSystemsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = operatingSystemActions;