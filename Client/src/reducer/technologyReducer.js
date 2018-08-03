import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const technologyReducer = (state = initialState.technologyReducer, action) => {
  switch(action.type) {
    case ActionType.GET_TECHNOLOGY_ALL: {
      return {
        ...state,
        technologyList: _.assign(action.technologies.data)
      };
    }
    case ActionType.GETALL_ACTIVE_TECHNOLOGIES: {
      return {
        ...state,
        technologiesActive: _.assign(action.technologiesActive.data)
      };
    }
    case ActionType.OPEN_ADDTECHNOLOGY_WINDOW : {
      return {
        ...state,
        addingTechnology: action.addingTechnology
      };
    }
    case ActionType.CLOSE_TECHNOLOGY_WINDOW: {
      return {
        ...state,
        addingTechnology: action.addingTechnology,
        updateTechnology: action.updateTechnology
      };
    }
    case ActionType.OPEN_UPDATETECHNOLOGY_WINDOW : {
      return {
        ...state,
        updateTechnology: action.updateTechnology
      };
    }

    case ActionType.GET_TECHNOLOGY: {
      return {
        ...state,
        technology: _.assign(action.technology.data)
      };
    }
    case ActionType.UPDATE_EXISTING_TECHNOLOGY_RESPONSE: {
      return {
        ...state,
        technology: _.assign(action.technology.data)
      };
    }

    default: { return state; }
  }
};

export default technologyReducer;