import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';
import appConstants from '../constants/AppConstants';



const applicationsReducer = (state = initialState.applicationReducer, action) => {  
    switch(action.type) {
        case ActionType.GET_APPLICATION_ALL: {
            // '...' spread operator clones the state
            // lodash Object assign simply clones action.courses into a new array.
            // The return object is a copy of state and overwrites the state.courses with a fresh clone of action.courses
            return {
                ...state,
                applicationList: _.assign(action.applications.data)
            };
        }
        case ActionType.OPEN_ADDAPPLICATION_WINDOW : {
          return {
              ...state,
              addingApplication: action.addingApplication
          };
        }

        case ActionType.OPEN_UPDATEAPPLICATION_WINDOW : {
          return {
              ...state,
              updateApplication: action.updateApplication
          };
        }

        case ActionType.GET_APPLICATION: {
          return {
              ...state,
              application: _.assign(action.application.data)
          };
        }

        case ActionType.UPDATE_EXISTING_APPLICATION_RESPONSE: {
          return {
              ...state,
              application: _.assign(action.application.data)
          };
        }

        case ActionType.CLOSE_APPLICATION_WINDOW: {
          return {
              ...state,
              addingApplication: action.addingApplication,
              updateApplication: action.updateApplication
          };
        }

        default: { return state; }
    }
};



export default applicationsReducer;
