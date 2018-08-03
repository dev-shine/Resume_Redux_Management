import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const frameworkReducer = (state = initialState.frameworkReducer, action) => {
  switch(action.type) {
    case ActionType.GET_FRAMEWORK_ALL: {
      return {
        ...state,
        frameworkList: _.assign(action.frameworks.data)
      };
    }
    case ActionType.OPEN_ADDFRAMEWORK_WINDOW : {
      return {
        ...state,
        addingFramework: action.addingFramework
      };
    }
    case ActionType.CLOSE_FRAMEWORK_WINDOW: {
      return {
        ...state,
        addingFramework: action.addingFramework,
        updateFramework: action.updateFramework
      };
    }
    case ActionType.OPEN_UPDATEFRAMEWORK_WINDOW : {
      return {
        ...state,
        updateFramework: action.updateFramework
      };
    }
    case ActionType.GET_FRAMEWORK: {
      return {
        ...state,
        framework: _.assign(action.framework.data)
      };
    }
    case ActionType.UPDATE_EXISTING_FRAMEWORK_RESPONSE: {
      return {
        ...state,
        framework: _.assign(action.framework.data)
      };
    }

    default: { return state; }
  }
};

export default frameworkReducer;