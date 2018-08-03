import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getTechnologyResponse = technologies => ({
  type: ActionType.GET_TECHNOLOGY_ALL,
  technologies
});

export const getAllActiveTechnologyResponse = technologiesActive => ({
  type: ActionType.GETALL_ACTIVE_TECHNOLOGIES,
  technologiesActive
});

export const getTechnologyByIdResponse = technology => ({
  type: ActionType.GET_TECHNOLOGY,
  technology
});

export const addNewTechnologyResponse = () => ({
  type: ActionType.ADD_NEW_TECHNOLOGY_RESPONSE
});

export const updateExistingTechnologyResponse = (technology) => ({
  type: ActionType.UPDATE_EXISTING_TECHNOLOGY_RESPONSE,
  technology
});

export const deleteTechnologyResponse = () => ({
  type: ActionType.DELETE_TECHNOLOGY_RESPONSE
});

export function getTechnologiesAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.TECHNOLOGY_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(technologies => {
      dispatch(getTechnologyResponse(technologies));
    })
    .catch(error => {
      throw error;
    });
  };
}

var technologyActions = {
  getAllTechnologies() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.TECHNOLOGY_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(technologies => {
        dispatch(getTechnologyResponse(technologies));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getAllActiveTechnologies() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.TECHNOLOGY_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(technologiesActive => {
        dispatch(getAllActiveTechnologyResponse(technologiesActive));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getTechnologyById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.TECHNOLOGY_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(technology => {
        dispatch(getTechnologyByIdResponse(technology));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddTechnologyWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDTECHNOLOGY_WINDOW,
        addingTechnology : true
      })
    }
  },
  openUpdateTechnologyWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATETECHNOLOGY_WINDOW,
        updateTechnology : true
      })
    }
  },
  closeTechnologyWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_TECHNOLOGY_WINDOW,
        addingTechnology : false,
        updateTechnology : false
      })
    }
  },
  technologyInsert(technology) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.TECHNOLOGY_INSERT,
        data: {
          ...technology
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewTechnologyResponse());
        dispatch(getTechnologiesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  technologyUpdate(technology) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.TECHNOLOGY_UPDATE,
        data: {
          ...technology
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingTechnologyResponse(technology));
        dispatch(getTechnologiesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  technologyDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.TECHNOLOGY_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteTechnologyResponse());
        dispatch(getTechnologiesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = technologyActions;