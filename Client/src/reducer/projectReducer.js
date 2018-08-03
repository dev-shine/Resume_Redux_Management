import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const projectReducer = (state = initialState.projectReducer, action) => {
  switch(action.type) {
    case ActionType.GET_PROJECT_ALL: {
      return {
        ...state,
        projectList: _.assign(action.projects.data)
      };
    }
    case ActionType.GETALL_ACTIVE_PROJECTS: {
      return {
        ...state,
        projectsActive: _.assign(action.projectsActive.data)
      };
    }
    case ActionType.OPEN_ADDPROJECT_WINDOW : {
      return {
        ...state,
        addingProject: action.addingProject
      };
    }
    case ActionType.CLOSE_PROJECT_WINDOW: {
      return {
        ...state,
        addingProject: action.addingProject,
        updateProject: action.updateProject
      };
    }
    case ActionType.OPEN_UPDATEPROJECT_WINDOW : {
      return {
        ...state,
        updateProject: action.updateProject
      };
    }
    case ActionType.GET_PROJECT: {
      return {
        ...state,
        project: _.assign(action.project.data[0])
      };
    }
    case ActionType.UPDATE_EXISTING_PROJECT_RESPONSE: {
      return {
        ...state,
        project: _.assign(action.project.data)
      };
    }

    default: { return state; }
  }
};

export default projectReducer;