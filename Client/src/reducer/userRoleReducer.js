import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const userRoleReducer = (state = initialState.userRoleReducer, action) => {
  switch(action.type) {
    case ActionType.GET_USERROLE: {
      return {
        ...state,
        userRole: _.assign(action.userRole)
      };
    }

    default: { return state; }
  }
};

export default userRoleReducer;