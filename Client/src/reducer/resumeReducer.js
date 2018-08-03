import * as ActionType from '../action/ActionType';
import initialState from './initialState';
import _ from 'lodash';



const resumeReducer = (state = initialState.resumeReducer, action) => {
    switch(action.type) {
        case ActionType.GET_RESUMES_RESPONSE: {
            return {
                ...state,
                resumes: _.assign(action.resumes)
            };
        }

        case ActionType.SET_PROJECTDETAILS: {
            return {
                ...state,
                projectDetails:  _.assign(action.projectDetails),
                test : Math.random()
            };
        }

        case ActionType.STORE_RESUME_GENERALDETAILS: {
            return {
                ...state,
                resumeGeneralDetails : _.assign(action.generaldetails),
                tabIndex :action.tabIndex
            };
        }

        case ActionType.SELECTED_TAB: {
            return {
                ...state,
                tabIndex :action.tabIndex
            };
        }

        case ActionType.ADD_PROJECTDETAIL_DIV: {
            return {
                ...state,
                projectDetailsDivCount :action.projectDetailsDivCount
            };
        }

        case ActionType.GET_RESUME_RESPONSE: {          
            return {
                ...state,
                resume :  _.assign(action.resume.data),
                projectDetails : _.assign(action.projectDetails),
                resumeGeneralDetails : _.assign(action.resume.data[0].candidates!=undefined ? action.resume.data[0].candidates : action.resume.data[0])
            };
        }

        case ActionType.CLEAR_RESUME_DETAILS: {
            return {
                ...state,
                resume :  action.resume,
                projectDetails : action.projectDetails,
                projectDetailsDivCount : action.projectDetailsDivCount,
                resumeGeneralDetails : action.resumeGeneralDetails
            };
        }

        case ActionType.CLEAR_CANDIDATE_DETAILS: {
            return {
                ...state,
                projectDetails : action.projectDetails,
                projectDetailsDivCount : action.projectDetailsDivCount,
                resumeGeneralDetails : action.resumeGeneralDetails,
                tabIndex : action.tabIndex,
                  resume :  action.resume
            };
        }

        default: { return state; }
    }
};

export default resumeReducer;
