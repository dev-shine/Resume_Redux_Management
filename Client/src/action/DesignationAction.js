import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getDesignationResponse = designations => ({
  type: ActionType.GET_DESIGNATION_ALL,
  designations
});

export const getDesignationByIdResponse = designation => ({
  type: ActionType.GET_DESIGNATION,
  designation
});

export const addNewDesignationResponse = () => ({
  type: ActionType.ADD_NEW_DESIGNATION_RESPONSE
});

export const updateExistingDesignationResponse = (designation) => ({
  type: ActionType.UPDATE_EXISTING_DESIGNATION_RESPONSE,
  designation
});

export const deleteDesignationResponse = () => ({
  type: ActionType.DELETE_DESIGNATION_RESPONSE
});

export function getDesignationsAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.DESIGNATION_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(designations => {
      dispatch(getDesignationResponse(designations));
    })
    .catch(error => {
      throw error;
    });
  };
}

var designationActions = {
  getAllDesignations() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.DESIGNATION_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(designations => {
        dispatch(getDesignationResponse(designations));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getDesignationById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.DESIGNATION_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(designation => {
        dispatch(getDesignationByIdResponse(designation));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddDesignationWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDDESIGNATION_WINDOW,
        addingDesignation : true
      })
    }
  },
  openUpdateDesignationWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEDESIGNATION_WINDOW,
        updateDesignation : true
      })
    }
  },
  closeDesignationWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_DESIGNATION_WINDOW,
        addingDesignation : false,
        updateDesignation : false
      })
    }
  },
  getAllActiveDesignations() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.DESIGNATION_ACTIVEGETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (designations) {
      return {
        type: appConstants.DESIGNATION_ACTIVEGETALL,
        designations
      };
    });
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
  },
  designationInsert(designation) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DESIGNATION_INSERT,
        data: {
          ...designation
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewDesignationResponse());
        dispatch(getDesignationsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  designationUpdate(designation) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DESIGNATION_UPDATE,
        data: {
          ...designation
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingDesignationResponse(designation));
        dispatch(getDesignationsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  designationDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DESIGNATION_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteDesignationResponse());
        dispatch(getDesignationsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = designationActions;