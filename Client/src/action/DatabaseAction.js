import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getDatabaseResponse = databases => ({
  type: ActionType.GET_DATABASE_ALL,
  databases
});

export const getAllActiveDatabaseResponse = databasesActive => ({
  type: ActionType.GETALL_ACTIVE_DATABASES,
  databasesActive
});

export const getDatabaseByIdResponse = database => ({
  type: ActionType.GET_DATABASE,
  database
});

export const addNewDatabaseResponse = () => ({
  type: ActionType.ADD_NEW_DATABASE_RESPONSE
});

export const updateExistingDatabaseResponse = (database) => ({
  type: ActionType.UPDATE_EXISTING_DATABASE_RESPONSE,
  database
});

export const deleteDatabaseResponse = () => ({
  type: ActionType.DELETE_DATABASE_RESPONSE
});

export function getDatabasesAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.DATABASE_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(databases => {
      dispatch(getDatabaseResponse(databases));
    })
    .catch(error => {
      throw error;
    });
  };
}

var databaseActions = {
  getAllDatabases() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.DATABASE_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(databases => {
        dispatch(getDatabaseResponse(databases));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getAllActiveDatabases() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.DATABASE_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(databasesActive => {
        dispatch(getAllActiveDatabaseResponse(databasesActive));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getDatabaseById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.DATABASE_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(database => {
        dispatch(getDatabaseByIdResponse(database));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddDatabaseWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDDATABASE_WINDOW,
        addingDatabase : true
      })
    }
  },
  openUpdateDatabaseWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEDATABASE_WINDOW,
        updateDatabase : true
      })
    }
  },
  closeDatabaseWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_DATABASE_WINDOW,
        addingDatabase : false,
        updateDatabase : false
      })
    }
  },
  databaseInsert(database) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DATABASE_INSERT,
        data: {
          ...database
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewDatabaseResponse());
        dispatch(getDatabasesAction());
        return response;
      })     
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  databaseUpdate(database) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DATABASE_UPDATE,
        data: {
          ...database
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingDatabaseResponse(database));
        dispatch(getDatabasesAction());
        return response;
      })     
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  databaseDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DATABASE_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteDatabaseResponse());
        dispatch(getDatabasesAction());
        return response;
      })    
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = databaseActions;