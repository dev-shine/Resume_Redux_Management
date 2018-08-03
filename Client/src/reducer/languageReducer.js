import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';

const languageReducer = (state = initialState.languageReducer, action) => {
  switch(action.type) {
    case ActionType.GET_LANGUAGE_ALL: {
      return {
        ...state,
        languageList: _.assign(action.languages.data)
      };
    }
    case ActionType.OPEN_ADDLANGUAGE_WINDOW : {
      return {
        ...state,
        addingLanguage: action.addingLanguage
      };
    }
    case ActionType.CLOSE_LANGUAGE_WINDOW: {
      return {
        ...state,
        addingLanguage: action.addingLanguage,
        updateLanguage: action.updateLanguage
      };
    }
    case ActionType.OPEN_UPDATELANGUAGE_WINDOW : {
      return {
        ...state,
        updateLanguage: action.updateLanguage
      };
    }

    case ActionType.GET_LANGUAGE: {
      return {
        ...state,
        language: _.assign(action.language.data)
      };
    }
    case ActionType.UPDATE_EXISTING_LANGUAGE_RESPONSE: {
      return {
        ...state,
        language: _.assign(action.language.data)
      };
    }

    default: { return state; }
  }
};

export default languageReducer;