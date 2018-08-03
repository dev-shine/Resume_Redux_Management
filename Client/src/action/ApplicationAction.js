import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';


export const getApplicationResponse = applications => ({
    type: ActionType.GET_APPLICATION_ALL,
    applications
});

export const getApplicationByIdResponse = application => ({
    type: ActionType.GET_APPLICATION,
    application
});

export const addNewApplicationResponse = () => ({
type: ActionType.ADD_NEW_APPLICATION_RESPONSE
});

export const updateExistingApplicationResponse = (application) => ({
type: ActionType.UPDATE_EXISTING_APPLICATION_RESPONSE,
application
});



export const deleteApplicationResponse = () => ({
type: ActionType.DELETE_APPLICATION_RESPONSE,
});


export function getApplicationsAction() {
    return (dispatch) => {
        dispatch(ApiCallBeginAction());

        return  axios({
              url: appConstants.APPLICATION_GETALL,
              method: 'GET',
              crossOrigin: true,
              headers: {
                  'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
              }
          })
            .then(applications => {
                dispatch(getApplicationResponse(applications));
            }).catch(error => {
                throw error;
            });
    };
}

var applicationActions = {

    getAllApplications() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        return (dispatch) => {
            dispatch(ApiCallBeginAction());
            axios({
                url: appConstants.APPLICATION_GETALL,
                method: 'GET',
                crossOrigin: true,
                headers: {
                    'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                }
            })
            .then(applications => {
                    dispatch(getApplicationResponse(applications));
                }).catch(error => {
                    throw error;
                });
        };
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    },

    getApplicationById(id) {
      return (dispatch) => {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_GETBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(application => {
                dispatch(getApplicationByIdResponse(application));
            }).catch(error => {
                throw error;
            });
  };
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    },

  openAddApplicationWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDAPPLICATION_WINDOW,
        addingApplication : true
      })
    }
  },

  openUpdateApplicationWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEAPPLICATION_WINDOW,
        updateApplication : true
      })
    }
  },

  closeApplicationWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_APPLICATION_WINDOW,
        addingApplication : false,
        updateApplication : false
      })
    }
  },



    getAllActiveApplications() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.APPLICATION_ACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (applications) {
            return {
                type: appConstants.APPLICATION_ACTIVEGETALL,
                applications
            };

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },

    applicationInsert(application) {
        return function (dispatch) {
            dispatch(ApiCallBeginAction());          
            return   axios({
                  url: appConstants.APPLICATION_INSERT,
                  data: {
                      ...application
                  },
                  method: 'POST',
                  crossOrigin: true,
                  headers: {
                      'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                  }
              })
                .then((response) => {

                        dispatch(addNewApplicationResponse());
                        dispatch(getApplicationsAction());
                        return response;
                })

                .catch(error => {
                    dispatch(ApiCallErrorAction());
                    throw (error);
                });
        };
    },

    applicationUpdate(application) {
        return function (dispatch) {
            dispatch(ApiCallBeginAction());
            return     axios({
                  url: appConstants.APPLICATION_UPDATE,
                  data: {
                    ...application
                  },
                  method: 'PUT',
                  crossOrigin: true,
                  headers: {
                      'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                  }
              })
                .then((response) => {
                  dispatch(updateExistingApplicationResponse(application));
                  dispatch(getApplicationsAction());
                  return response;
                })

                .catch(error => {
                    dispatch(ApiCallErrorAction());
                    throw (error);
                });
        };
    },

    applicationDelete(id) {
            return (dispatch) => {
            dispatch(ApiCallBeginAction());
            return    axios({
                  url: appConstants.APPLICATION_DELETE + id,
                  method: 'DELETE',
                  crossOrigin: true,
                  headers: {
                      'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                  }
              })
              .then(response => response)
                .then((response) => {
                   dispatch(deleteApplicationResponse());
                   dispatch(getApplicationsAction());
                  return response;

                })
                .catch(error => {
                    dispatch(ApiCallErrorAction());
                    throw (error);
                });
        };
    }
}

module.exports = applicationActions;
