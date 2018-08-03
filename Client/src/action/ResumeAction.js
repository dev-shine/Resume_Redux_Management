import * as ActionType from './ActionType';
import { ApiCallBeginAction, ApiCallErrorAction } from './ApiAction';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';
import {reset} from 'redux-form';


export const getResumesResponse = resumes => ({
    type: ActionType.GET_RESUMES_RESPONSE,
    resumes
});

export const getResumeDetailsByIdResponse = resumedetails => ({
    type: ActionType.GET_RESUMEDETAIL_RESPONSE,
    resumedetails
});

export const getResumeByIdResponse = (resume, projectDetails) => ({
    type: ActionType.GET_RESUME_RESPONSE,
    resume : resume,
    projectDetails : projectDetails
});

export function getProjectDetails (resume) {
  var projectDetails = [];
  resume.map(function(item){
    if(item.projectroles != undefined)
    {
      var details = {
        "RoleName" : item.projectroles[0].ProjectRoleName,
        "ProjectName" : item.projects.ProjectName,
        "ProjectId" : item.projects._id,
        "RoleId" : item.projectroles[0]._id,
        "Responsibilities" : item.Responsibilities
      }
      projectDetails.push(details);
    }
    else {
      return [];
    }
});
  return projectDetails;
}

export const addNewResumeResponse = () => ({
    type: ActionType.ADD_NEW_RESUME_RESPONSE
});

export const createResumeResponse = () => ({
    type: ActionType.CREATE_RESUME_RESPONSE
});

export const deleteResumeResponse = () => ({
    type: ActionType.DELETE_RESUME_RESPONSE
});

export const updateExistingResumeResponse = (resume) => ({
    type: ActionType.UPDATE_EXISTING_RESUME_RESPONSE,
    resume
});

export const storeResumeGeneralDetails = (generaldetails) => ({
    type: ActionType.STORE_RESUME_GENERALDETAILS,
    generaldetails : generaldetails,
    tabIndex : 1
});


export function getResumeAction() {
    return (dispatch) => {
        dispatch(ApiCallBeginAction());

        return  axios({
              url: appConstants.RESUME_GETALL,
              method: 'GET',
              crossOrigin: true,
              headers: {
                  'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
              }
          })
            .then(resumes => {
                dispatch(getResumesResponse(resumes));
            }).catch(error => {
                throw error;
            });
    };
}

var resumeActions = {
  getAllResumes() {
      return (dispatch) => {
          dispatch(ApiCallBeginAction());
          document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
          return axios({
                  url: appConstants.RESUME_GETALL,
                  method: 'GET',
                  crossOrigin: true,
                  headers: {
                      'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                  }
              })
              .then(resumes => {
                  dispatch(getResumesResponse(resumes.data));
              }).catch(error => {
                  throw error;
              });
      };

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
  },



  storeGeneralDetails(values) {
      return (dispatch) => {
          dispatch(ApiCallBeginAction());
          document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
          return  dispatch(storeResumeGeneralDetails(values));
      };

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
  },

  setSelectedTab(tabIndex)
  {
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      return dispatch({
        type : ActionType.SELECTED_TAB,
        tabIndex : tabIndex
      });
    }
  },

  setProjectDetails(projectDetails)
  {
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      dispatch(reset('ProjectDetailForm'));
      return dispatch({
        type : ActionType.SET_PROJECTDETAILS,
        projectDetails : projectDetails,

      });
    }
  },

  addProjectDetailDivCount()
  {
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      return dispatch({
        type : ActionType.ADD_PROJECTDETAIL_DIV,
        projectDetailsDivCount : [{'key':1}]
      });
    }
  },

  clearResumeDetails()
  {
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      return dispatch({
        type : ActionType.CLEAR_RESUME_DETAILS,
        resume : undefined,
        projectDetails : [],
        projectDetailsDivCount : [],
        resumeGeneralDetails : undefined
      });
    }
  },

  clearCandidateDetails()
  {
    return (dispatch) => {
      dispatch(ApiCallBeginAction());
      return dispatch({
        type : ActionType.CLEAR_CANDIDATE_DETAILS,
        projectDetails : [],
        projectDetailsDivCount : [],
        //resumeGeneralDetails : undefined,
        tabIndex : 0,
        resume : undefined
      });
    }
  },




    getAllResumeDetailsById(id) {
        return (dispatch) => {
            dispatch(ApiCallBeginAction());
            document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
            return   axios({
                  url: appConstants.RESUME_GETALLDETAILSBYID + id,
                  method: 'GET',
                  crossOrigin: true,
                  headers: {
                      'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                  }
              })
                .then(resume => {
                    dispatch(getResumeByIdResponse(resume , getProjectDetails(resume.data) ));
                }).catch(error => {
                    throw error;
                });
        };
          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    },


    getResumeById(id) {
        return (dispatch) => {
            dispatch(ApiCallBeginAction());
            document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
            return axios({
                url: appConstants.RESUME_GETBYID + id,
                method: 'GET',
                crossOrigin: true,
                headers: {
                    'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                }
            })
                .then(resume => {
                  debugger;
                    // dispatch(getResumeByIdResponse(resume));
                }).catch(error => {
                    throw error;
                });
        };
        document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
    },


    resumeInsert(resume) {
    return function (dispatch) {
        dispatch(ApiCallBeginAction());
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        return axios({
            url: appConstants.RESUME_INSERT,
            data: {
                ...resume
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
            .then((response) => {
              debugger;
                    dispatch(addNewResumeResponse());
                    dispatch(getResumesResponse(response.data.data));
                    return response;
            })
            .catch(error => {
                dispatch(ApiCallErrorAction());
                throw (error);
            });
    };
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
},

resumeCreation(candidateId) {
    return function (dispatch) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      const resumeData = { CandidateId : candidateId };
        dispatch(ApiCallBeginAction());
        return axios({
            url: appConstants.RESUMECREATION,
            data: {
              ...resumeData
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
            .then((response) => {
              dispatch(createResumeResponse());
              dispatch(getResumeAction());
              return response;
            })
            .catch(error => {
                dispatch(ApiCallErrorAction());
                throw (error);
            });
    };
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
},


  resumeUpdate(resume) {
    return function (dispatch) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        dispatch(ApiCallBeginAction());
        return axios({
            url: appConstants.RESUME_UPDATE,
            data: {
              ...resume
            },
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
            .then(response => {
              dispatch(updateExistingResumeResponse(response));
              dispatch(getResumeAction());
              return response;
            })
            .catch(error => {
                dispatch(ApiCallErrorAction());
                throw (error);
            });
    };
    document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
},

  resumeDelete(id) {
  return function (dispatch) {
    document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      dispatch(ApiCallBeginAction());
      return axios({
          url: appConstants.RESUME_DELETE + id,
          method: 'DELETE',
          crossOrigin: true,
          headers: {
              'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
          }
      })
          .then(response => {
            dispatch(deleteResumeResponse());
              dispatch(getResumesResponse(response.data.data));
            return response;
          })
          .catch(error => {
              dispatch(ApiCallErrorAction());
              throw (error);
          });
  };
  document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
  }
};

module.exports = resumeActions;
