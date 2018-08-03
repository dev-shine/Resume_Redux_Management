import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const databaseReducer = (state = initialState.databaseReducer, action) => {
  switch(action.type) {
    case ActionType.GET_DATABASE_ALL: {
      return {
        ...state,
        databaseList: _.assign(action.databases.data)
      };
    }
    case ActionType.GETALL_ACTIVE_DATABASES: {
      return {
        ...state,
        databasesActive: _.assign(action.databasesActive.data)
      };
    }
    case ActionType.OPEN_ADDDATABASE_WINDOW : {
      return {
        ...state,
        addingDatabase: action.addingDatabase
      };
    }
    case ActionType.CLOSE_DATABASE_WINDOW: {
      return {
        ...state,
        addingDatabase: action.addingDatabase,
        updateDatabase: action.updateDatabase
      };
    }
    case ActionType.OPEN_UPDATEDATABASE_WINDOW : {
      return {
        ...state,
        updateDatabase: action.updateDatabase
      };
    }

    case ActionType.GET_DATABASE: {
      return {
        ...state,
        database: _.assign(action.database.data)
      };
    }
    case ActionType.UPDATE_EXISTING_DATABASE_RESPONSE: {
      return {
        ...state,
        database: _.assign(action.database.data)
      };
    }

    default: { return state; }
  }
};

export default databaseReducer;