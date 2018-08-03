import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const permissionModuleReducer = (state = initialState.permissionModuleReducer, action) => {
  switch(action.type) {
    case ActionType.GET_PERMISSIONMODULE_ALL: {
      return {
        ...state,
        permissionModuleList: _.assign(action.permissionModules)
      };
    }

    default: { return state; }
  }
};

export default permissionModuleReducer;