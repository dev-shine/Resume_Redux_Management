import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getLanguageResponse = languages => ({
  type: ActionType.GET_LANGUAGE_ALL,
  languages
});

export const getLanguageByIdResponse = language => ({
  type: ActionType.GET_LANGUAGE,
  language
});

export const addNewLanguageResponse = () => ({
  type: ActionType.ADD_NEW_LANGUAGE_RESPONSE
});

export const updateExistingLanguageResponse = (language) => ({
  type: ActionType.UPDATE_EXISTING_LANGUAGE_RESPONSE,
  language
});

export const deleteLanguageResponse = () => ({
  type: ActionType.DELETE_LANGUAGE_RESPONSE
});

export function getLanguagesAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.LANGUAGE_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(languages => {
      dispatch(getLanguageResponse(languages));
    })
    .catch(error => {
      throw error;
    });
  };
}

var languageActions = {
  getAllLanguages() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.LANGUAGE_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(languages => {
        dispatch(getLanguageResponse(languages));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getLanguageById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.LANGUAGE_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(language => {
        dispatch(getLanguageByIdResponse(language));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddLanguageWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDLANGUAGE_WINDOW,
        addingLanguage : true
      })
    }
  },
  openUpdateLanguageWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATELANGUAGE_WINDOW,
        updateLanguage : true
      })
    }
  },
  closeLanguageWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_LANGUAGE_WINDOW,
        addingLanguage : false,
        updateLanguage : false
      })
    }
  },
  getAllActiveLanguages() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    axios({
      url: appConstants.LANGUAGE_ACTIVEGETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(function (languages) {
      return {
        type: appConstants.LANGUAGE_ACTIVEGETALL,
        languages
      };
    });
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
  },
  languageInsert(language) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.LANGUAGE_INSERT,
        data: {
          ...language
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewLanguageResponse());
        dispatch(getLanguagesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  languageUpdate(language) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.LANGUAGE_UPDATE,
        data: {
          ...language
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingLanguageResponse(language));
        dispatch(getLanguagesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  languageDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.LANGUAGE_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(deleteLanguageResponse());
        dispatch(getLanguagesAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = languageActions;