import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getProjectResponse = projects => ({
  type: ActionType.GET_PROJECT_ALL,
  projects
});

export const getAllActiveProjectResponse = projectsActive => ({
  type: ActionType.GETALL_ACTIVE_PROJECTS,
  projectsActive
});

export const getProjectByIdResponse = project => ({
  type: ActionType.GET_PROJECT,
  project
});

export const addNewProjectResponse = () => ({
  type: ActionType.ADD_NEW_PROJECT_RESPONSE
});

export const updateExistingProjectResponse = (project) => ({
  type: ActionType.UPDATE_EXISTING_PROJECT_RESPONSE,
  project
});

export const deleteProjectResponse = (project) => ({
  type: ActionType.DELETE_PROJECT_RESPONSE
});

export function getProjectsAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.PROJECT_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(projects => {
      dispatch(getProjectResponse(projects));
    })
    .catch(error => {
      throw error;
    });
  };
}

var projectActions = {
  getAllProjects() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.PROJECT_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(projects => {
        dispatch(getProjectResponse(projects));
      })
      .catch(error => {
          throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getAllActiveProjects() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
    axios({
      url: appConstants.PROJECT_ACTIVEGETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(projectsActive => {
        dispatch(getAllActiveProjectResponse(projectsActive));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getProjectById(id) {
  return (dispatch) => {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.PROJECT_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(project => {
        dispatch(getProjectByIdResponse(project));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddProjectWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDPROJECT_WINDOW,
        addingProject : true
      })
    }
  },
  openUpdateProjectWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEPROJECT_WINDOW,
        updateProject : true
      })
    }
  },
  closeProjectWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_PROJECT_WINDOW,
        addingProject : false,
        updateProject : false
      })
    }
  },
  projectInsert(project) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.PROJECT_INSERT,
        data: {
          ...project
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewProjectResponse());
        dispatch(getProjectsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  projectUpdate(project) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.PROJECT_UPDATE,
        data: {
          ...project
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingProjectResponse(project));
         dispatch(getProjectsAction());
         return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  projectDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.PROJECT_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteProjectResponse());
        dispatch(getProjectsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = projectActions;