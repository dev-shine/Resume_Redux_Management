import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const domainReducer = (state = initialState.domainReducer, action) => {
  switch(action.type) {
    case ActionType.GET_DOMAIN_ALL: {
      return {
        ...state,
        domainList: _.assign(action.domains.data)
      };
    }
    case ActionType.GETALL_ACTIVE_DOMAINS: {
      return {
        ...state,
        domainsActive: _.assign(action.domainsActive.data)
      };
    }
    case ActionType.OPEN_ADDDOMAIN_WINDOW : {
      return {
        ...state,
        addingDomain: action.addingDomain
      };
    }
    case ActionType.CLOSE_DOMAIN_WINDOW: {
      return {
        ...state,
        addingDomain: action.addingDomain,
        updateDomain: action.updateDomain
      };
    }
    case ActionType.OPEN_UPDATEDOMAIN_WINDOW : {
      return {
        ...state,
        updateDomain: action.updateDomain
      };
    }

    case ActionType.GET_DOMAIN: {
      return {
        ...state,
        domain: _.assign(action.domain.data)
      };
    }
    case ActionType.UPDATE_EXISTING_DOMAIN_RESPONSE: {
      return {
        ...state,
        domain: _.assign(action.domain.data)
      };
    }

    default: { return state; }
  }
};

export default domainReducer;