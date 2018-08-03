import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getFrameworkResponse = frameworks => ({
  type: ActionType.GET_FRAMEWORK_ALL,
  frameworks
});

export const getFrameworkByIdResponse = framework => ({
  type: ActionType.GET_FRAMEWORK,
  framework
});

export const addNewFrameworkResponse = () => ({
  type: ActionType.ADD_NEW_FRAMEWORK_RESPONSE
});

export const updateExistingFrameworkResponse = (framework) => ({
  type: ActionType.UPDATE_EXISTING_FRAMEWORK_RESPONSE,
  framework
});

export const deleteFrameworkResponse = () => ({
  type: ActionType.DELETE_FRAMEWORK_RESPONSE
});

export function getFrameworksAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.FRAMEWORK_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(frameworks => {
      dispatch(getFrameworkResponse(frameworks));
    })
    .catch(error => {
      throw error;
    });
  };
}

var frameworkActions = {
  getAllFrameworks() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.FRAMEWORK_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(frameworks => {
        dispatch(getFrameworkResponse(frameworks));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getFrameworkById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.FRAMEWORK_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(framework => {
        dispatch(getFrameworkByIdResponse(framework));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddFrameworkWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDFRAMEWORK_WINDOW,
        addingFramework : true
      })
    }
  },
  openUpdateFrameworkWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEFRAMEWORK_WINDOW,
        updateFramework : true
      })
    }
  },
  closeFrameworkWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_FRAMEWORK_WINDOW,
        addingFramework : false,
        updateFramework : false
      })
    }
  },
  getAllActiveFrameworks() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.FRAMEWORK_ACTIVEGETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (frameworks) {
      return {
        type: appConstants.FRAMEWORK_ACTIVEGETALL,
        frameworks
      };
    });
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
  },
  frameworkInsert(framework) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.FRAMEWORK_INSERT,
        data: {
          ...framework
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewFrameworkResponse());
        dispatch(getFrameworksAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  frameworkUpdate(framework) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.FRAMEWORK_UPDATE,
        data: {
          ...framework
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingFrameworkResponse(framework));
        dispatch(getFrameworksAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  frameworkDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.FRAMEWORK_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteFrameworkResponse());
        dispatch(getFrameworksAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = frameworkActions;