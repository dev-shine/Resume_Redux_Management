import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const operatingSystemReducer = (state = initialState.operatingSystemReducer, action) => {
  switch(action.type) {
    case ActionType.GET_OPERATINGSYSTEM_ALL: {
      return {
        ...state,
        operatingSystemList: _.assign(action.operatingSystems.data)
      };
    }
    case ActionType.GETALL_ACTIVE_OPERATINGSYSTEMS: {
      return {
        ...state,
        operatingSystemsActive: _.assign(action.operatingSystemsActive.data)
      };
    }
    case ActionType.OPEN_ADDOPERATINGSYSTEM_WINDOW : {
      return {
        ...state,
        addingOperatingSystem: action.addingOperatingSystem
      };
    }
    case ActionType.CLOSE_OPERATINGSYSTEM_WINDOW: {
      return {
        ...state,
        addingOperatingSystem: action.addingOperatingSystem,
        updateOperatingSystem: action.updateOperatingSystem
      };
    }
    case ActionType.OPEN_UPDATEOPERATINGSYSTEM_WINDOW : {
      return {
        ...state,
        updateOperatingSystem: action.updateOperatingSystem
      };
    }

    case ActionType.GET_OPERATINGSYSTEM: {
      return {
        ...state,
        operatingSystem: _.assign(action.operatingSystem.data)
      };
    }
    case ActionType.UPDATE_EXISTING_OPERATINGSYSTEM_RESPONSE: {
      return {
        ...state,
        operatingSystem: _.assign(action.operatingSystem.data)
      };
    }

    default: { return state; }
  }
};

export default operatingSystemReducer;