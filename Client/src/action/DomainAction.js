import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

export const getDomainResponse = domains => ({
  type: ActionType.GET_DOMAIN_ALL,
  domains
});

export const getAllActiveDomainResponse = domainsActive => ({
  type: ActionType.GETALL_ACTIVE_DOMAINS,
  domainsActive
});

export const getDomainByIdResponse = domain => ({
  type: ActionType.GET_DOMAIN,
  domain
});

export const addNewDomainResponse = () => ({
  type: ActionType.ADD_NEW_DOMAIN_RESPONSE
});

export const updateExistingDomainResponse = (domain) => ({
  type: ActionType.UPDATE_EXISTING_DOMAIN_RESPONSE,
  domain
});

export const deleteDomainResponse = () => ({
  type: ActionType.DELETE_DOMAIN_RESPONSE
});

export function getDomainsAction() {
  return (dispatch) => {
    dispatch(ApiCallBeginAction());
    return axios({
      url: appConstants.DOMAIN_GETALL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
      }
    })
    .then(domains => {
      dispatch(getDomainResponse(domains));
    })
    .catch(error => {
      throw error;
    });
  };
}

var domainActions = {
  getAllDomains() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.DOMAIN_GETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(domains => {
        dispatch(getDomainResponse(domains));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getAllActiveDomains() {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      axios({
        url: appConstants.DOMAIN_ACTIVEGETALL,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(domainsActive => {
        dispatch(getAllActiveDomainResponse(domainsActive));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  getDomainById(id) {
    return (dispatch) => {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      axios({
        url: appConstants.DOMAIN_GETBYID + id,
        method: 'GET',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then(domain => {
        dispatch(getDomainByIdResponse(domain));
      })
      .catch(error => {
        throw error;
      });
      document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    };
  },
  openAddDomainWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_ADDDOMAIN_WINDOW,
        addingDomain : true
      })
    }
  },
  openUpdateDomainWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.OPEN_UPDATEDOMAIN_WINDOW,
        updateDomain : true
      })
    }
  },
  closeDomainWindow() {
    return (dispatch) => {
      dispatch({
        type: ActionType.CLOSE_DOMAIN_WINDOW,
        addingDomain : false,
        updateDomain : false
      })
    }
  },
  domainInsert(domain) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DOMAIN_INSERT,
        data: {
          ...domain
        },
        method: 'POST',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(addNewDomainResponse());
        dispatch(getDomainsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  domainUpdate(domain) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DOMAIN_UPDATE,
        data: {
          ...domain
        },
        method: 'PUT',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
        dispatch(updateExistingDomainResponse(domain));
        dispatch(getDomainsAction());
        return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  },
  domainDelete(id) {
    return function (dispatch) {
      dispatch(ApiCallBeginAction());
      return axios({
        url: appConstants.DOMAIN_DELETE + id,
        method: 'DELETE',
        crossOrigin: true,
        headers: {
          'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
        }
      })
      .then((response) => {
      dispatch(deleteDomainResponse());
      dispatch(getDomainsAction());
      return response;
      })
      .catch(error => {
        dispatch(ApiCallErrorAction());
        throw (error);
      });
    };
  }
};

module.exports = domainActions;