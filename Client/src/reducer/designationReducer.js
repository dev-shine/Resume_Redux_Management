import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const designationReducer = (state = initialState.designationReducer, action) => {
  switch(action.type) {
    case ActionType.GET_DESIGNATION_ALL: {
      return {
        ...state,
        designationList: _.assign(action.designations.data)
      };
    }
    case ActionType.OPEN_ADDDESIGNATION_WINDOW : {
      return {
        ...state,
        addingDesignation: action.addingDesignation
      };
    }
    case ActionType.CLOSE_DESIGNATION_WINDOW: {
      return {
        ...state,
        addingDesignation: action.addingDesignation,
        updateDesignation: action.updateDesignation
      };
    }
    case ActionType.OPEN_UPDATEDESIGNATION_WINDOW : {
      return {
        ...state,
        updateDesignation: action.updateDesignation
      };
    }

    case ActionType.GET_DESIGNATION: {
      return {
        ...state,
        designation: _.assign(action.designation.data)
      };
    }
    case ActionType.UPDATE_EXISTING_DESIGNATION_RESPONSE: {
      return {
        ...state,
        designation: _.assign(action.designation.data)
      };
    }

    default: { return state; }
  }
};

export default designationReducer;